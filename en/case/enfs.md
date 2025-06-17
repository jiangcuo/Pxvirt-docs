## 1. eNFS Introduction

eNFS is an enhancement for NFS clients that supports NFS multipathing, load balancing, and failover.
For detailed information, please refer to:
- https://docs.openeuler.org/zh/docs/20.03_LTS_SP4/docs/eNFS/enfs使用指南.html
- [Operating System Technology White Paper Innovation Project Overview](https://www.openeuler.org/whitepaper/openEuler操作系统（创新项目总览）.pdf)

## 2. Enabling eNFS in PXVIRT

### 2.1 Common eNFS Architecture

The PXVIRT host has 2 IPs, such as 10.13.13.1, 10.13.14.1

The NFS server has 2 IPs, such as 10.13.13.254, 10.13.14.254

```
┌─────────────────────┐                    ┌─────────────────────┐
│    PXVIRT Host       │                    │     NFS Server      │
│                     │                    │                     │
│  ┌─────────────┐    │                    │  ┌─────────────┐    │
│  │ eNFS Client  │    │                    │  │ NFS Server  │    │
│  └─────────────┘    │                    │  └─────────────┘    │
│         │           │                    │         │           │
│    ┌────┴────┐      │                    │    ┌────┴────┐      │
│    │10.13.13.1│ ────┼──────────────────────────→│10.13.13.254│ │
│    └─────────┘      │  Connection Path 1  │     └─────────┘      │
│                     │                    │                     │
│    ┌─────────┐      │                    │    ┌─────────┐      │
│    │10.13.14.1│ ────┼──────────────────────────→│10.13.14.254│ │
│    └─────────┘      │  Connection Path 2  │    └─────────┘      │
│                     │                    │                     │
└─────────────────────┘                    └─────────────────────┘
```

You can enable eNFS for the PXVIRT cluster, so that PXVIRT hosts will simultaneously connect to 10.13.13.254 and 10.13.14.254, enabling load balancing and multipathing.

### 2.2 Enabling eNFS in PXVIRT

#### 2.2.1 System Requirements

    1. Requires kernel `6.6-openeuler`, version >= `6.6.0-10`
    2. NFS server must enable v3 support, as eNFS only supports v3.

Since eNFS is a client-side enhancement and has no relation to the NFS server, as long as the kernel requirements are met, different PXVIRT and PVE versions are also supported.

#### 2.2.2 Create eNFS Configuration File on Each Node (Optional)

```
cat /etc/enfs/config.ini
# Enable multipath
multipath_disable=0
```

#### 2.2.3 Create Cluster NFS Service

Edit `/etc/pve/storage.cfg`
```
nfs: nfs
        export /NFS/vm
        path /mnt/pve/nfs
        server 10.13.14.3
        content images
        options remoteaddrs=10.13.14.3~10.13.13.3,vers=3
        prune-backups keep-all=1
```

You can also create an NFS storage directly in the WebUI, select vers=3, and then add options to `/etc/pve/storage.cfg`. This will enable the eNFS module on the PXVIRT host, which will then search for local IPs to connect to the two NFS servers 10.13.14.3 and 10.13.13.3.

#### 2.2.4 Verification

Enter `mount` to view the current status, which should show eNFS and remoteaddrs:
```
....
10.13.14.3:/NFS/vm on /mnt/pve/nfs type nfs 
(rw,relatime,vers=3,rsize=1048576,wsize=1048576,namlen=255,hard,
proto=tcp,timeo=600,retrans=2,sec=sys,mountaddr=10.13.14.3,
mountvers=3,mountport=36277,mountproto=udp,
local_lock=none,addr=10.13.14.3,remoteaddrs=10.13.14.3~10.13.13.
3,slookupcache=all,alookupcache=all,enfs_info=10.13.14.3_1)
...
```

You can check the eNFS status in proc at path `/proc/enfs/<nfsserver>/stat`:
```
root@pxvirt-test1:~# cat  /proc/enfs/*/stat 
id    local_addr     remote_addr    r_count               r_rtt                 r_exec                w_count               w_rtt                 w_exec                queuelen              
0     10.13.14.81    10.13.14.3     0                     0                     0                     499                   7                     24                    0                     
1     10.13.13.81    10.13.13.3     0                     0                     0                     525                   6                     26                    0                     
root@pxvirt-test1:~# 
```

## 3. eNFS Configuration Reference

### 3.1 Configuration File Format
- Lines starting with `#` are comments
- Configuration items in `key=value` format
- Empty lines are ignored
- Configuration items are case-insensitive
- Supports dynamic hot reloading (for some configuration items)

### 3.2 Detailed Configuration Parameter Descriptions

#### 1. path_detect_interval - Path Detection Interval

**Function**:
- Controls the frequency of ENFS health status detection for multipath network connections
- The system periodically sends probe packets to check the availability of each path
- Used to implement fault detection and automatic switching

**Default Value**: 10 seconds  
**Range**: 5-300 seconds

**Use Cases**:
- **High Availability Environment**: Set smaller values (5-10 seconds) for rapid fault detection
- **Stable Network**: Set larger values (60-120 seconds) to reduce network overhead
- **Bandwidth Limited**: Increase interval to reduce probe traffic

**Configuration Examples**:
```ini
# High availability scenario - rapid fault detection
path_detect_interval=5

# General scenario - balance performance and overhead
path_detect_interval=10

# Stable network - reduce probe overhead
path_detect_interval=60
```

#### 2. path_detect_timeout - Path Detection Timeout

**Function**:
- Sets the timeout for a single path probe
- If no response is received within this time, the path is considered faulty
- Affects the sensitivity of fault detection

**Default Value**: 5 seconds  
**Range**: 1-60 seconds

**Use Cases**:
- **Fast Network**: Set smaller values (1-3 seconds) for quick fault discovery
- **Slow Network**: Set larger values (10-20 seconds) to avoid false positives
- **Cross WAN**: Appropriately increase timeout

**Configuration Examples**:
```ini
# High-speed LAN environment
path_detect_timeout=2

# Standard enterprise network
path_detect_timeout=5

# Cross WAN or satellite links
path_detect_timeout=15
```

#### 3. multipath_timeout - Multipath Timeout

**Function**:
- Controls the overall timeout for multipath operations
- Maximum wait time when all paths are unresponsive
- 0 means use timeout parameters specified by mount command

**Default Value**: 0 (use mount parameters)  
**Range**: 0-60 seconds

**Use Cases**:
- **Strict SLA**: Set fixed timeout to ensure response time
- **Fault Tolerance Priority**: Set larger values to allow more retries
- **Default Behavior**: Set 0 to use mount command parameters

**Configuration Examples**:
```ini
# Use mount command's timeo parameter
multipath_timeout=0

# Financial trading system - strict timeout control
multipath_timeout=10

# Batch processing system - allow longer wait
multipath_timeout=30
```

#### 4. multipath_disable - Multipath Function Switch

**Function**:
- Globally enable or disable ENFS multipath functionality
- When disabled, ENFS degrades to standard NFS behavior
- Used for fault diagnosis or compatibility issue troubleshooting

**Default Value**: 0 (enabled)  
**Range**: 0-1

**Use Cases**:
- **Production Environment**: Set 0 to enable multipath for high availability
- **Troubleshooting**: Temporarily set 1 to troubleshoot network issues
- **Compatibility Testing**: Verify application behavior under single path

**Configuration Examples**:
```ini
# Production environment - enable multipath
multipath_disable=0

# Troubleshooting - temporarily disable multipath
multipath_disable=1
```

#### 5. multipath_select_policy - Multipath Selection Policy

**Function**:
- Controls how to select transmission paths among multiple available paths
- Affects load balancing effectiveness and performance distribution
- Supports different business scenario requirements

**Default Value**: roundrobin  
**Available Values**:
- `roundrobin`: Round-robin mode, evenly distribute requests
- `shardview`: Shard view mode, select paths based on data sharding

**Use Cases**:
- **General Scenarios**: roundrobin suitable for most applications
- **Large File Transfer**: shardview may provide better performance
- **Specific Optimization**: Choose based on storage system characteristics

**Configuration Examples**:
```ini
# Standard load balancing
multipath_select_policy=roundrobin

# Optimized for sharded storage
multipath_select_policy=shardview
```

#### 6. dns_update_interval - DNS Update Interval

**Function**:
- Controls the update frequency of DNS resolution results
- Used to dynamically discover new server IP addresses
- Supports elastic scaling in cloud environments

**Default Value**: 5 minutes  
**Range**: 0-2147483647 minutes

**Use Cases**:
- **Cloud Environment**: Shorter intervals (1-5 minutes) for rapid IP change adaptation
- **Static Environment**: Longer intervals (60-120 minutes) to reduce DNS queries
- **Disable Updates**: Set 0 to disable automatic DNS updates

**Configuration Examples**:
```ini
# Cloud-native environment - frequent updates
dns_update_interval=1

# Standard enterprise environment
dns_update_interval=5

# Static IP environment - reduce DNS queries
dns_update_interval=60

# Disable automatic DNS updates
dns_update_interval=0
```

#### 7. dns_auto_multipath_resolution - DNS Automatic Multipath Resolution

**Function**:
- Automatically resolve a single DNS name to multiple IP addresses
- Automatically create multipath based on DNS Round-Robin
- Simplifies multipath configuration without manual IP specification

**Default Value**: 0 (disabled)  
**Range**: 0-1

**Use Cases**:
- **Simplified Configuration**: Enable automatic multipath discovery without manual configuration
- **Cloud Environment**: Suitable for scenarios using load balancers
- **Traditional Configuration**: Disable to use manually specified IP lists

**Configuration Examples**:
```ini
# Enable automatic multipath discovery
dns_auto_multipath_resolution=1

# Use manually configured IP lists
dns_auto_multipath_resolution=0
```

**Practical Usage Examples**:
```bash
# When auto-resolution is enabled, single hostname resolves to multiple IPs
# Example: nfs.example.com -> 192.168.1.10, 192.168.1.11, 192.168.1.12
mount -t nfs nfs.example.com:/data /mnt/data

# When disabled, need to manually specify multipath
mount -t nfs -o remoteaddrs=192.168.1.10,192.168.1.11 server:/data /mnt/data
```

#### 8. shardview_update_interval - Shard View Update Interval

**Function**:
- Controls the update frequency of storage shard information
- Used for metadata synchronization in distributed storage systems
- Affects data consistency and performance optimization

**Default Value**: 60 seconds  
**Range**: 30-300 seconds

**Use Cases**:
- **Frequent Changes**: Use shorter intervals when shards are frequently adjusted
- **Stable Systems**: Use longer intervals when shard layout is stable
- **Performance Optimization**: Adjust based on metadata update overhead

**Configuration Examples**:
```ini
# Dynamic sharding environment
shardview_update_interval=30

# Standard configuration
shardview_update_interval=60

# Stable environment - reduce metadata queries
shardview_update_interval=180
```

#### 9. priopity_array_wwns - Priority WWN Array

**Function**:
- Sets the priority order of storage devices
- WWN (World Wide Name) is the unique identifier of storage devices
- Prioritizes use of listed storage devices for data transmission

**Format**: Comma-separated WWN list  
**Maximum Count**: 6

**Use Cases**:
- **Storage Tiering**: Prioritize high-performance storage devices
- **Proximity Access**: Prioritize local or nearby storage
- **Cost Control**: Prioritize low-cost storage

**Configuration Examples**:
```ini
# Prioritize high-performance SSD storage
priopity_array_wwns=21:00:00:24:ff:7f:4a:01,21:00:00:24:ff:7f:4a:02

# Multi-storage tiering strategy
priopity_array_wwns=ssd001,ssd002,sas003,sata004
```

#### 10. local_ip_filters - Local IP Filters

**Function**:
- Restricts the local network interfaces used by ENFS
- Controls outbound network traffic through IP address ranges
- Implements network isolation and security policies

**Format**: Comma-separated IP addresses or network segments  
**Maximum Count**: 8

**Use Cases**:
- **Network Isolation**: Restrict use of specific network segment interfaces
- **Performance Optimization**: Only use high-bandwidth network interfaces
- **Security Policy**: Avoid transmission through insecure networks

**Configuration Examples**:
```ini
# Only use high-speed internal network
local_ip_filters=192.168.1.0/24,10.0.0.0/8

# Multi-NIC environment - specify dedicated storage network
local_ip_filters=172.16.0.0/16,172.17.0.0/16

# Exclude management network - only use business network
local_ip_filters=10.1.0.0/16,10.2.0.0/16
```

#### 11. lookupcache_interval - Lookup Cache Interval

**Function**:
- Controls the cache time for file/directory lookup results
- Reduces redundant network lookup requests
- Balances performance and data consistency

**Default Value**: 60 seconds  
**Range**: 30 seconds - 2147483647 seconds

**Use Cases**:
- **Frequent Access**: Shorter cache time to ensure data freshness
- **Stable Directories**: Longer cache time to improve performance
- **Real-time Requirements**: Adjust based on business needs

**Configuration Examples**:
```ini
# High real-time requirements
lookupcache_interval=30

# Standard configuration
lookupcache_interval=60

# Static file system - long-term cache
lookupcache_interval=3600
```

#### 12. lookupcache_enable - Lookup Cache Enable

**Function**:
- Globally enable or disable lookup cache functionality
- Affects directory and file metadata caching behavior
- Used for performance tuning or troubleshooting

**Default Value**: 1 (enabled)  
**Range**: 0-1

**Use Cases**:
- **Performance Optimization**: Enable cache to reduce network overhead
- **Real-time Requirements**: Disable cache to ensure latest data
- **Debug Issues**: Temporarily disable to troubleshoot cache-related problems

**Configuration Examples**:
```ini
# Enable cache to improve performance
lookupcache_enable=1

# Disable cache to ensure real-time data
lookupcache_enable=0
```

#### 13. link_count_per_mount - Links Per Mount Point

**Function**:
- Limits the maximum number of network connections a single NFS mount point can use
- Controls resource consumption of individual mount points
- Prevents a single mount point from consuming too many system resources

**Default Value**: 32  
**Range**: 2-1024

**Use Cases**:
- **High Concurrency**: Increase connection count to improve concurrent performance
- **Resource Limitation**: Reduce connection count to save system resources
- **Load Balancing**: Adjust based on server capacity

**Configuration Examples**:
```ini
# High-performance server
link_count_per_mount=128

# Standard configuration
link_count_per_mount=32

# Resource-constrained environment
link_count_per_mount=8
```

#### 14. link_count_total - Total System Links

**Function**:
- Limits the maximum total number of network connections for the entire system
- Prevents too many connections from exhausting system resources
- System-level resource protection

**Default Value**: 512  
**Range**: 512-16384

**Use Cases**:
- **Large Systems**: Increase total connections to support more mount points
- **Embedded Systems**: Reduce connections to adapt to hardware limitations
- **Cloud Environment**: Adjust based on instance specifications

**Configuration Examples**:
```ini
# Large server
link_count_total=8192

# Standard server
link_count_total=512

# Edge device
link_count_total=256
```

#### 15. native_link_io_enable - Native Link IO Enable

**Function**:
- Enable or disable native network IO optimization
- Affects the implementation of underlying network transmission
- May provide better performance or compatibility

**Default Value**: 1 (enabled)  
**Range**: 0-1

**Use Cases**:
- **Performance Optimization**: Enable for better IO performance
- **Compatibility Issues**: Disable to resolve certain network device compatibility
- **Debug Analysis**: Switch different implementations for performance comparison

**Configuration Examples**:
```ini
# Enable native IO optimization
native_link_io_enable=1

# Compatibility mode
native_link_io_enable=0
```

#### 16. create_path_no_route - Create Path No Route

**Function**:
- Controls whether to still attempt connection creation when there's no network route
- Used to handle scenarios with incomplete network configuration
- Affects fault tolerance behavior of connection establishment

**Default Value**: 0 (disabled)  
**Range**: 0-1

**Use Cases**:
- **Dynamic Routing**: Enable to handle dynamic route changes
- **Static Configuration**: Disable to avoid invalid connection attempts
- **Network Fault Recovery**: Enable to support network self-healing

**Configuration Examples**:
```ini
# Dynamic network environment
create_path_no_route=1

# Static network configuration
create_path_no_route=0
```

### 3.3 Complete Configuration Examples

#### 3.3.1 High-Performance Production Environment Configuration
```ini
# ENFS high-performance production environment configuration
# Suitable for high-bandwidth, low-latency enterprise network environments

# Path detection - rapid fault discovery
path_detect_interval=10
path_detect_timeout=3

# Multipath configuration - enable all features
multipath_disable=0
multipath_timeout=15
multipath_select_policy=roundrobin

# DNS configuration - support dynamic environment
dns_update_interval=5
dns_auto_multipath_resolution=1

# Shard view - standard update interval
shardview_update_interval=60

# Cache configuration - balance performance and consistency
lookupcache_enable=1
lookupcache_interval=60

# Connection count configuration - high concurrency support
link_count_per_mount=64
link_count_total=2048

# Performance optimization
native_link_io_enable=1
create_path_no_route=0

# Network configuration - use high-speed storage network
local_ip_filters=10.1.0.0/16,10.2.0.0/16

# Storage priority - prioritize SSD usage
priopity_array_wwns=ssd001,ssd002,ssd003
```

#### 3.3.2 Cloud Environment Configuration
```ini
# ENFS cloud environment configuration
# Suitable for elastic scaling cloud computing environments

# Path detection - adapt to cloud network characteristics
path_detect_interval=15
path_detect_timeout=5

# Multipath configuration
multipath_disable=0
multipath_timeout=0
multipath_select_policy=roundrobin

# DNS configuration - frequent updates for elastic IP adaptation
dns_update_interval=2
dns_auto_multipath_resolution=1

# Shard view - shorter interval for dynamic scaling adaptation
shardview_update_interval=45

# Cache configuration - shorter cache for dynamic change adaptation
lookupcache_enable=1
lookupcache_interval=30

# Connection count configuration - medium scale
link_count_per_mount=32
link_count_total=1024

# Cloud environment optimization
native_link_io_enable=1
create_path_no_route=1
```

#### 3.3.3 Edge Computing Configuration
```ini
# ENFS edge computing configuration
# Suitable for resource-constrained edge devices

# Path detection - longer interval to save resources
path_detect_interval=30
path_detect_timeout=10

# Multipath configuration - basic functionality
multipath_disable=0
multipath_timeout=20
multipath_select_policy=roundrobin

# DNS configuration - reduce DNS queries
dns_update_interval=30
dns_auto_multipath_resolution=0

# Shard view - longer interval to save resources
shardview_update_interval=120

# Cache configuration - long-term cache to reduce network requests
lookupcache_enable=1
lookupcache_interval=300

# Connection count configuration - limit resource consumption
link_count_per_mount=8
link_count_total=128

# Resource-saving configuration
native_link_io_enable=1
create_path_no_route=0
```

#### 3.3.4 Performance Tuning Recommendations

#### 3.3.5 High IOPS Scenarios
- Reduce `path_detect_interval` and `path_detect_timeout`
- Increase `link_count_per_mount`
- Enable `native_link_io_enable`
- Use `roundrobin` load balancing strategy

#### 3.3.6 Large File Transfer Scenarios
- Appropriately increase `multipath_timeout`
- Consider using `shardview` strategy
- Increase total connection count `link_count_total`
- Use dedicated storage network (configure `local_ip_filters`)

#### 3.3.7 WAN Scenarios
- Increase various timeout parameters
- Enable long-term caching
- Reduce DNS update frequency
- Enable `create_path_no_route` to handle network fluctuations

### 3.4 Troubleshooting

#### 3.4.1 Common Issues and Configuration Adjustments
1. **Frequent Connection Drops**: Increase `path_detect_timeout`
2. **Poor Performance**: Check `link_count_per_mount` settings
3. **DNS Resolution Issues**: Adjust `dns_update_interval` or disable `dns_auto_multipath_resolution`
4. **Cache Consistency Issues**: Reduce `lookupcache_interval` or disable cache

#### 3.4.2 Debug Configuration
```ini
# Troubleshooting configuration - disable optimization features for analysis
multipath_disable=1
lookupcache_enable=0
dns_auto_multipath_resolution=0
native_link_io_enable=0
```

Through proper configuration of these parameters, ENFS can achieve optimal performance in different network environments and application scenarios.