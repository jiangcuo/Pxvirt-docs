# Ceph RDMA Cluster

RDMA can effectively reduce CPU usage and lower data latency.

To enable RDMA for Ceph, you need hardware and switches that support RDMA. Before following this document, please make sure your Ceph cluster is already built.

This setup only routes Ceph's OSD network over RDMA, not all traffic.

## Environment

Version: 8.4 openEuler

NIC: ConnectX-5

Network info:
 - pxvirt1: 10.120.121.247/24 -> enp6s16
 - pxvirt2: 10.120.121.245/24 -> enp6s16
 - pxvirt3: 10.120.121.243/24 -> enp6s16

The RDMA NIC only carries storage traffic, so no bridge is configured — it's bound to a dedicated port instead.


## Notes

Only ports on the same RDMA card support bonding, so from a redundancy standpoint this doesn't help much. If the card fails, one of the Ceph links goes down. To get more redundancy you need multiple cluster networks or public networks.


## Install the RDMA tool packages

You can use pvessh to quickly install these on every node.
```
pvessh dnf makecache
pvessh dnf install -y infiniband-diags mlnx-tools libibverbs-utils librdmacm-utils rdma-core 
```

```
[root@pxvirt1 ~]# pvessh dnf install -y infiniband-diags libibverbs-utils librdmacm-utils  mlnx-tools rdma-core 
Duplicate specification "times!" for option "times"
Duplicate specification "timeout=i" for option "timeout"
Hosts: 10.40.50.247 10.40.50.243 10.40.50.245
Command: dnf install -y infiniband-diags libibverbs-utils librdmacm-utils rdma-core mlnx-tools

-=< 10.40.50.247 >=-------------------------------------------------------------
Last metadata expiration check: 0:11:09 ago on Mon Jul 20 15:11:35 2026.
Dependencies resolved.
================================================================================
 Package                Architecture Version                 Repository    Size
================================================================================
Installing:
 infiniband-diags       x86_64       50.0-44.oe2403sp3       update       286 k
 libibverbs-utils       x86_64       50.0-44.oe2403sp3       update        59 k
 librdmacm-utils        x86_64       50.0-44.oe2403sp3       update        78 k
 rdma-core              x86_64       50.0-44.oe2403sp3       update        45 k
Installing dependencies:
 libibumad              x86_64       50.0-44.oe2403sp3       update        25 k

Transaction Summary
================================================================================
Install  5 Packages

Total download size: 492 k
Installed size: 1.7 M
Downloading Packages:
(1/5): libibumad-50.0-44.oe2403sp3.x86_64.rpm    21 kB/s |  25 kB     00:01    
(2/5): infiniband-diags-50.0-44.oe2403sp3.x86_6 217 kB/s | 286 kB     00:01    
(3/5): libibverbs-utils-50.0-44.oe2403sp3.x86_6  39 kB/s |  59 kB     00:01    
(4/5): rdma-core-50.0-44.oe2403sp3.x86_64.rpm    74 kB/s |  45 kB     00:00    
(5/5): librdmacm-utils-50.0-44.oe2403sp3.x86_64 101 kB/s |  78 kB     00:00    
--------------------------------------------------------------------------------
Total                                           251 kB/s | 492 kB     00:01     
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                        1/1 
  Installing       : libibumad-50.0-44.oe2403sp3.x86_64                     1/5 
  Installing       : infiniband-diags-50.0-44.oe2403sp3.x86_64              2/5 
  Installing       : rdma-core-50.0-44.oe2403sp3.x86_64                     3/5 
  Running scriptlet: rdma-core-50.0-44.oe2403sp3.x86_64                     3/5 
  Installing       : librdmacm-utils-50.0-44.oe2403sp3.x86_64               4/5 
  Installing       : libibverbs-utils-50.0-44.oe2403sp3.x86_64              5/5 
  Running scriptlet: libibverbs-utils-50.0-44.oe2403sp3.x86_64              5/5 
  Verifying        : infiniband-diags-50.0-44.oe2403sp3.x86_64              1/5 
  Verifying        : libibumad-50.0-44.oe2403sp3.x86_64                     2/5 
  Verifying        : libibverbs-utils-50.0-44.oe2403sp3.x86_64              3/5 
  Verifying        : librdmacm-utils-50.0-44.oe2403sp3.x86_64               4/5 
  Verifying        : rdma-core-50.0-44.oe2403sp3.x86_64                     5/5 

Installed:
  infiniband-diags-50.0-44.oe2403sp3.x86_64                                     
  libibumad-50.0-44.oe2403sp3.x86_64                                            
  libibverbs-utils-50.0-44.oe2403sp3.x86_64                                     
  librdmacm-utils-50.0-44.oe2403sp3.x86_64                                      
  rdma-core-50.0-44.oe2403sp3.x86_64                                            

Complete!
-=< 10.40.50.243 >=-------------------------------------------------------------
Warning: Permanently added '10.40.50.243' (ED25519) to the list of known hosts.
Last metadata expiration check: 0:09:04 ago on Mon Jul 20 15:13:40 2026.
Dependencies resolved.
================================================================================
 Package                Architecture Version                 Repository    Size
================================================================================
Installing:
 infiniband-diags       x86_64       50.0-44.oe2403sp3       update       286 k
 libibverbs-utils       x86_64       50.0-44.oe2403sp3       update        59 k
 librdmacm-utils        x86_64       50.0-44.oe2403sp3       update        78 k
 rdma-core              x86_64       50.0-44.oe2403sp3       update        45 k
Installing dependencies:
 libibumad              x86_64       50.0-44.oe2403sp3       update        25 k

Transaction Summary
================================================================================
Install  5 Packages

Total download size: 492 k
Installed size: 1.7 M
Downloading Packages:
(1/5): libibumad-50.0-44.oe2403sp3.x86_64.rpm    86 kB/s |  25 kB     00:00    
(2/5): infiniband-diags-50.0-44.oe2403sp3.x86_6 956 kB/s | 286 kB     00:00    
(3/5): libibverbs-utils-50.0-44.oe2403sp3.x86_6 186 kB/s |  59 kB     00:00    
(4/5): rdma-core-50.0-44.oe2403sp3.x86_64.rpm   415 kB/s |  45 kB     00:00    
(5/5): librdmacm-utils-50.0-44.oe2403sp3.x86_64 453 kB/s |  78 kB     00:00    
--------------------------------------------------------------------------------
Total                                           1.0 MB/s | 492 kB     00:00     
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                        1/1 
  Installing       : libibumad-50.0-44.oe2403sp3.x86_64                     1/5 
  Installing       : infiniband-diags-50.0-44.oe2403sp3.x86_64              2/5 
  Installing       : rdma-core-50.0-44.oe2403sp3.x86_64                     3/5 
  Running scriptlet: rdma-core-50.0-44.oe2403sp3.x86_64                     3/5 
  Installing       : librdmacm-utils-50.0-44.oe2403sp3.x86_64               4/5 
  Installing       : libibverbs-utils-50.0-44.oe2403sp3.x86_64              5/5 
  Running scriptlet: libibverbs-utils-50.0-44.oe2403sp3.x86_64              5/5 
  Verifying        : infiniband-diags-50.0-44.oe2403sp3.x86_64              1/5 
  Verifying        : libibumad-50.0-44.oe2403sp3.x86_64                     2/5 
  Verifying        : libibverbs-utils-50.0-44.oe2403sp3.x86_64              3/5 
  Verifying        : librdmacm-utils-50.0-44.oe2403sp3.x86_64               4/5 
  Verifying        : rdma-core-50.0-44.oe2403sp3.x86_64                     5/5 

Installed:
  infiniband-diags-50.0-44.oe2403sp3.x86_64                                     
  libibumad-50.0-44.oe2403sp3.x86_64                                            
  libibverbs-utils-50.0-44.oe2403sp3.x86_64                                     
  librdmacm-utils-50.0-44.oe2403sp3.x86_64                                      
  rdma-core-50.0-44.oe2403sp3.x86_64                                            

Complete!
-=< 10.40.50.245 >=-------------------------------------------------------------
Warning: Permanently added '10.40.50.245' (ED25519) to the list of known hosts.
Last metadata expiration check: 0:10:22 ago on Mon Jul 20 15:12:22 2026.
Dependencies resolved.
================================================================================
 Package                Architecture Version                 Repository    Size
================================================================================
Installing:
 infiniband-diags       x86_64       50.0-44.oe2403sp3       update       286 k
 libibverbs-utils       x86_64       50.0-44.oe2403sp3       update        59 k
 librdmacm-utils        x86_64       50.0-44.oe2403sp3       update        78 k
 rdma-core              x86_64       50.0-44.oe2403sp3       update        45 k
Installing dependencies:
 libibumad              x86_64       50.0-44.oe2403sp3       update        25 k

Transaction Summary
================================================================================
Install  5 Packages

Total download size: 492 k
Installed size: 1.7 M
Downloading Packages:
(1/5): infiniband-diags-50.0-44.oe2403sp3.x86_6 197 kB/s | 286 kB     00:01    
(2/5): libibumad-50.0-44.oe2403sp3.x86_64.rpm    16 kB/s |  25 kB     00:01    
(3/5): libibverbs-utils-50.0-44.oe2403sp3.x86_6  32 kB/s |  59 kB     00:01    
(4/5): rdma-core-50.0-44.oe2403sp3.x86_64.rpm    64 kB/s |  45 kB     00:00    
(5/5): librdmacm-utils-50.0-44.oe2403sp3.x86_64  58 kB/s |  78 kB     00:01    
--------------------------------------------------------------------------------
Total                                           176 kB/s | 492 kB     00:02     
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                        1/1 
  Installing       : libibumad-50.0-44.oe2403sp3.x86_64                     1/5 
  Installing       : infiniband-diags-50.0-44.oe2403sp3.x86_64              2/5 
  Installing       : rdma-core-50.0-44.oe2403sp3.x86_64                     3/5 
  Running scriptlet: rdma-core-50.0-44.oe2403sp3.x86_64                     3/5 
  Installing       : librdmacm-utils-50.0-44.oe2403sp3.x86_64               4/5 
  Installing       : libibverbs-utils-50.0-44.oe2403sp3.x86_64              5/5 
  Running scriptlet: libibverbs-utils-50.0-44.oe2403sp3.x86_64              5/5 
  Verifying        : infiniband-diags-50.0-44.oe2403sp3.x86_64              1/5 
  Verifying        : libibumad-50.0-44.oe2403sp3.x86_64                     2/5 
  Verifying        : libibverbs-utils-50.0-44.oe2403sp3.x86_64              3/5 
  Verifying        : librdmacm-utils-50.0-44.oe2403sp3.x86_64               4/5 
  Verifying        : rdma-core-50.0-44.oe2403sp3.x86_64                     5/5 

Installed:
  infiniband-diags-50.0-44.oe2403sp3.x86_64                                     
  libibumad-50.0-44.oe2403sp3.x86_64                                            
  libibverbs-utils-50.0-44.oe2403sp3.x86_64                                     
  librdmacm-utils-50.0-44.oe2403sp3.x86_64                                      
  rdma-core-50.0-44.oe2403sp3.x86_64                                            

Complete!
[root@pxvirt1 ~]# 
```

## Check IB status

Use `ibv_devinfo` to check the IB devices on a node.

Here you can see the device, `rocep6s16` in this case:

```
[root@pxvirt1 ~]# ibv_devinfo 
hca_id: rocep6s16
        transport:                      InfiniBand (0)
        fw_ver:                         16.35.3006
        node_guid:                      8c2a:8eff:fe88:9b0f
        sys_image_guid:                 8c2a:8e03:00f8:4268
        vendor_id:                      0x02c9
        vendor_part_id:                 4120
        hw_ver:                         0x0
        board_id:                       HUA0000000005
        phys_port_cnt:                  1
                port:   1
                        state:                  PORT_ACTIVE (4)
                        max_mtu:                4096 (5)
                        active_mtu:             1024 (3)
                        sm_lid:                 0
                        port_lid:               0
                        port_lmc:               0x00
                        link_layer:             Ethernet

```

Use `show_gids` to look up the GID of the RDMA device. Below, the row where `IPv4` and `VER` is `v2` is the `gid` we need, which is `3`.
```
[root@pxvirt1 ~]# show_gids
DEV     PORT    INDEX   GID                                     IPv4            VER     DEV
---     ----    -----   ---                                     ------------    ---     ---
rocep6s16       1       0       fe80:0000:0000:0000:8e2a:8eff:fe88:9b0f                 v1      enp6s16
rocep6s16       1       1       fe80:0000:0000:0000:8e2a:8eff:fe88:9b0f                 v2      enp6s16
rocep6s16       1       2       0000:0000:0000:0000:0000:ffff:0a78:79f7 10.120.121.247          v1      enp6s16
rocep6s16       1       3       0000:0000:0000:0000:0000:ffff:0a78:79f7 10.120.121.247          v2      enp6s16
```


## Configure limits

Ceph needs more memory.

```bash
tee /etc/security/limits.d/ceph-rdma.conf  > /dev/null <<'EOF'
*       soft    memlock         unlimited
*       hard    memlock         unlimited
EOF
```

You also need to configure systemd for the mon, mgr, and osd services (`PrivateDevices=no` lets the daemons access `/dev/infiniband`):

```bash
for svc in ceph-mon ceph-mgr ceph-osd; do
  mkdir -p /usr/lib/systemd/system/${svc}@.service.d
  tee /usr/lib/systemd/system/${svc}@.service.d/limit.conf > /dev/null <<'EOF'
[Service]
LimitMEMLOCK=infinity
PrivateDevices=no
EOF
done
```

Reload systemd and restart the services:

```
systemctl daemon-reload
systemctl restart ceph-mon@$(hostname) ceph-mgr@$(hostname)
```



## Enable RDMA for Ceph

### Before you start!
Since RDMA requires the NIC's device name and index, and these can differ between machines with different hardware, each node needs its own `ceph.conf`. However, PVE symlinks `/etc/ceph/ceph.conf` to `/etc/pve/ceph.conf`; once you remove that symlink, Ceph can no longer be conveniently managed from the UI, which makes things much less convenient.

So we provide solutions for 3 different scenarios.

### Same hardware, same NIC on every node

This applies when your machines all have the same model, the same PCIe slot layout, and the same NIC model — i.e. every machine's configuration is identical.

Edit `/etc/pve/ceph.conf` on each node.

Add the following to the `global` section:

```
ms_cluster_type =  async+rdma
ms_async_rdma_type = ib
ms_async_rdma_device_name =  rocep6s16
ms_async_rdma_gid_idx = 3
```

`ms_async_rdma_device_name` is the `hca_id` value from the `ibv_devinfo` output.

`ms_async_rdma_gid_idx` is the GID index, which determines whether RoCE v1 or v2 is used.

### Different hardware, same NIC on every node

Here the machines differ but the NIC model is the same, so their GIDs are also the same. We can use udev to pin the RDMA device name, which lets us use a single global configuration.

Use `udevadm info -a /sys/class/infiniband/{your_device}| grep "node_guid"` to look up the NIC's `node_guid`:

```
[root@pxvirt2 ~]# udevadm info -a /sys/class/infiniband/rocep6s16 |grep "node_guid"
    ATTR{node_guid}=="8c2a:8eff:fe88:9b10"
[root@pxvirt2 ~]# 
```

Here the `node_guid` is `8c2a:8eff:fe88:9b10`. We'll use this value as the match condition in the udev rule.

Create the udev rule:

`touch /etc/udev/rules.d/60-rdma-persistent-naming.rules`

Add:

```
ACTION=="add", SUBSYSTEM=="infiniband", \
ATTR{node_guid}=="8c2a:8eff:fe88:9b10", \
PROGRAM="rdma_rename %k NAME_FIXED rdma0"
```

`rdma0` is the fixed IB device name.

After making the change, reload udev:

```bash
udevadm control --reload
udevadm trigger --subsystem-match=infiniband --action=add
```

You can see the device is now named rdma0:
```bash
[root@pxvirt2 ~]# udevadm control --reload
[root@pxvirt2 ~]# udevadm trigger --subsystem-match=infiniband --action=add
[root@pxvirt2 ~]# ibstat
CA 'rdma0'
        CA type: MT4120
        Number of ports: 1
        Firmware version: 16.35.3006
        Hardware version: 0
        Node GUID: 0x8c2a8efffe889b10
        System image GUID: 0x8c2a8e0300f84268
        Port 1:
                State: Active
                Physical state: LinkUp
                Rate: 100
                Base lid: 0
                LMC: 0
                SM lid: 0
                Capability mask: 0x00010000
                Port GUID: 0x8e2a8efffe889b10
                Link layer: Ethernet
[root@pxvirt2 ~]# 
```

Finally, add the following to the `global` section of `/etc/pve/ceph.conf`:

```
ms_cluster_type =  async+rdma
ms_async_rdma_type = ib
ms_async_rdma_device_name =  rdma0
ms_async_rdma_gid_idx = 3
```


### Different hardware, different NICs

PVE's Ceph configuration is centralized in `/etc/pve/ceph.conf`:

```
[root@pxvirt1 ~]# ls -la /etc/ceph/ceph.conf 
lrwxrwxrwx 1 root root 18 Jul 20 15:19 /etc/ceph/ceph.conf -> /etc/pve/ceph.conf
[root@pxvirt1 ~]# 
```

But since the RDMA device name can differ between nodes here, you need to remove the symlink and then copy the Ceph config file to a local path on each node:

```
pvessh unlink /etc/ceph/ceph.conf
pvessh cp /etc/pve/ceph.conf /etc/ceph/ceph.conf
```

Edit `/etc/ceph/ceph.conf` on each node.

Add the following to the `global` section:

```
ms_cluster_type =  async+rdma
ms_async_rdma_type = ib
ms_async_rdma_device_name =  rocep2s16
ms_async_rdma_gid_idx = 3
```


## Restart the cluster

## Verify RDMA

Run on any node:

```bash
ceph config show osd.0 | grep -iE 'ms_cluster_type|rdma'
```

```bash
[root@pxvirt3 ~]# ceph config show osd.0 | grep -iE 'ms_cluster_type|rdma'
ms_async_rdma_device_name                        rdma0                                         file                        
ms_async_rdma_gid_idx                            3                                             file                        
ms_async_rdma_type                               ib                                            file                        
ms_cluster_type                                  async+rdma                                    file                        
[root@pxvirt3 ~]# 
```


On the node hosting OSD 0, check Ceph's RDMA messenger counters (tx_bytes/rx_bytes should keep growing):

```bash
ceph daemon /var/run/ceph/ceph-osd.0.asok perf dump | grep -A 15 RDMAWorker
```

Or check the NIC's RDMA hardware counters (mlx5 tracks RDMA traffic separately):

```bash
watch -d "ethtool -S enp6s16 | grep -i rdma"
```
