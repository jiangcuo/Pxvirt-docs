## 一、eNFS 介绍

eNFS是一个nfs客户端的增强，支持nfs多路径，负载均衡，故障转移。
具体信息请查看
- https://docs.openeuler.org/zh/docs/20.03_LTS_SP4/docs/eNFS/enfs使用指南.html
- [操作系统技术白皮书创新项目总览](https://www.openeuler.org/whitepaper/openEuler操作系统（创新项目总览）.pdf)

## 二、PXVIRT 启用eNFS

### 2.1 常见eNFS架构

pxvirt 主机 具有2个ip。如10.13.13.1，10.13.14.1

NFS server 具有2个ip，如10.13.13.254，10.13.14.254

```
┌─────────────────────┐                    ┌─────────────────────┐
│    PXVIRT主机        │                    │     NFS服务器        │
│                     │                    │                     │
│  ┌─────────────┐    │                    │  ┌─────────────┐    │
│  │ eNFS客户端   │    │                    │  │ NFS Server  │    │
│  └─────────────┘    │                    │  └─────────────┘    │
│         │           │                    │         │           │
│    ┌────┴────┐      │                    │    ┌────┴────┐      │
│    │10.13.13.1│ ────┼──────────────────────────→│10.13.13.254│ │
│    └─────────┘      │  连接路径1          │     └─────────┘      │
│                     │                    │                     │
│    ┌─────────┐      │                    │    ┌─────────┐      │
│    │10.13.14.1│ ────┼──────────────────────────→│10.13.14.254│ │
│    └─────────┘      │  连接路径2           │    └─────────┘      │
│                     │                    │                     │
└─────────────────────┘                    └─────────────────────┘
```

可以为pxvirt集群启用enfs，这样pxvirt主机将会同时连接到10.13.13.254，10.13.14.254，并启用负载均衡和多路径。

### 2.2 在pxvirt 启用enfs

#### 2.2.1 系统要求

    1. 要求内核为`6.6-openeuler`，且大于 >= `6.6.0-10`
    2. nfs server启用v3支持，enfs仅支持v3.

因为enfs是客户端增强，和nfs server没关系，只要内核满足要求，不同的pxvirt和pve版本也支持。


#### 2.2.2 每个节点上创建enfs配置文件 （可选）

```
cat /etc/enfs/config.ini
# 启用多路径
multipath_disable=0
```
#### 2.2.3 创建一个集群的nfs服务

编辑`/etc/pve/storage.cfg`
```
nfs: nfs
        export /NFS/vm
        path /mnt/pve/nfs
        server 10.13.14.3
        content images
        options remoteaddrs=10.13.14.3~10.13.13.3,vers=3
        prune-backups keep-all=1
```

也可以直接在webui上创建一个nfs存储，选择vers=3，随后在`/etc/pve/storage.cfg`添加options。这样pxvirt主机上的enfs模块将会被启用，随后查找本地的ip，去连接到10.13.14.3 10.13.13.3 这2个nfs 服务器。

#### 2.2.4 验证
输入`mount` 可以查看当前的状态，有enfs和remoteaddrs
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
可以在proc中查看enfs的情况,路径位于 `/proc/enfs/<nfsserver>/stat`
```
root@pxvirt-test1:~# cat  /proc/enfs/*/stat 
id    local_addr     remote_addr    r_count               r_rtt                 r_exec                w_count               w_rtt                 w_exec                queuelen              
0     10.13.14.81    10.13.14.3     0                     0                     0                     499                   7                     24                    0                     
1     10.13.13.81    10.13.13.3     0                     0                     0                     525                   6                     26                    0                     
root@pxvirt-test1:~# 
```


## 三、eNFS 配置说明

### 3.1 配置文件格式
- `#` 开头的行为注释
- `key=value` 格式的配置项  
- 空行会被忽略
- 配置项不区分大小写
- 支持动态热加载（部分配置项）

### 3.2 详细配置项说明

#### 1. path_detect_interval - 路径检测间隔

**功能作用**：
- 控制ENFS对多路径网络连接健康状态的检测频率
- 系统会定期发送探测包检查每条路径的可用性
- 用于实现故障检测和自动切换

**默认值**：10秒  
**取值范围**：5-300秒

**使用场景**：
- **高可用环境**：设置较小值（5-10秒）实现快速故障检测
- **稳定网络**：设置较大值（60-120秒）减少网络开销
- **带宽受限**：增大间隔减少探测流量

**配置示例**：
```ini
# 高可用场景 - 快速故障检测
path_detect_interval=5

# 普通场景 - 平衡性能和开销
path_detect_interval=10

# 稳定网络 - 减少探测开销
path_detect_interval=60
```

#### 2. path_detect_timeout - 路径检测超时

**功能作用**：
- 设置单次路径探测的超时时间
- 超过此时间未收到响应则认为路径故障
- 影响故障检测的灵敏度

**默认值**：5秒  
**取值范围**：1-60秒

**使用场景**：
- **快速网络**：设置较小值（1-3秒）快速发现故障
- **慢速网络**：设置较大值（10-20秒）避免误判
- **跨广域网**：适当增大超时时间

**配置示例**：
```ini
# 局域网高速环境
path_detect_timeout=2

# 标准企业网络
path_detect_timeout=5

# 跨WAN或卫星链路
path_detect_timeout=15
```

#### 3. multipath_timeout - 多路径超时

**功能作用**：
- 控制多路径操作的总体超时时间
- 当所有路径都无响应时的最大等待时间
- 0表示使用mount命令指定的超时参数

**默认值**：0（使用mount参数）  
**取值范围**：0-60秒

**使用场景**：
- **严格SLA**：设置固定超时确保响应时间
- **容错优先**：设置较大值允许更多重试
- **默认行为**：设置0使用mount命令参数

**配置示例**：
```ini
# 使用mount命令的timeo参数
multipath_timeout=0

# 金融交易系统 - 严格超时控制
multipath_timeout=10

# 批处理系统 - 允许较长等待
multipath_timeout=30
```

#### 4. multipath_disable - 多路径功能开关

**功能作用**：
- 全局启用或禁用ENFS的多路径功能
- 禁用时ENFS退化为标准NFS行为
- 用于故障诊断或兼容性问题排查

**默认值**：0（启用）  
**取值范围**：0-1

**使用场景**：
- **生产环境**：设置0启用多路径获得高可用性
- **故障排查**：临时设置1排查网络问题
- **兼容测试**：验证应用在单路径下的行为

**配置示例**：
```ini
# 生产环境 - 启用多路径
multipath_disable=0

# 故障排查 - 临时禁用多路径
multipath_disable=1
```

#### 5. multipath_select_policy - 多路径选择策略

**功能作用**：
- 控制在多条可用路径中如何选择传输路径
- 影响负载均衡效果和性能分布
- 支持不同的业务场景需求

**默认值**：roundrobin  
**可选值**：
- `roundrobin`：轮询模式，平均分配请求
- `shardview`：分片视图模式，基于数据分片选择路径

**使用场景**：
- **通用场景**：roundrobin适合大多数应用
- **大文件传输**：shardview可能提供更好的性能
- **特定优化**：根据存储系统特性选择

**配置示例**：
```ini
# 标准负载均衡
multipath_select_policy=roundrobin

# 针对分片存储优化
multipath_select_policy=shardview
```

#### 6. dns_update_interval - DNS更新间隔

**功能作用**：
- 控制DNS解析结果的更新频率
- 用于动态发现新的服务器IP地址
- 支持云环境中的弹性扩缩容

**默认值**：5分钟  
**取值范围**：0-2147483647分钟

**使用场景**：
- **云环境**：较短间隔（1-5分钟）快速适应IP变化
- **静态环境**：较长间隔（60-120分钟）减少DNS查询
- **禁用更新**：设置0禁用自动DNS更新

**配置示例**：
```ini
# 云原生环境 - 频繁更新
dns_update_interval=1

# 标准企业环境
dns_update_interval=5

# 静态IP环境 - 减少DNS查询
dns_update_interval=60

# 禁用DNS自动更新
dns_update_interval=0
```

#### 7. dns_auto_multipath_resolution - DNS自动多路径解析

**功能作用**：
- 自动将单个DNS名称解析为多个IP地址
- 基于DNS轮询(Round-Robin DNS)自动创建多路径
- 简化多路径配置，无需手动指定多个IP

**默认值**：0（禁用）  
**取值范围**：0-1

**使用场景**：
- **简化配置**：启用后自动发现多路径，无需手工配置
- **云环境**：适合使用负载均衡器的场景
- **传统配置**：禁用后使用手工指定的IP列表

**配置示例**：
```ini
# 启用自动多路径发现
dns_auto_multipath_resolution=1

# 使用手工配置的IP列表
dns_auto_multipath_resolution=0
```

**实际使用例子**：
```bash
# 启用自动解析时，单个hostname会解析出多个IP
# 例如：nfs.example.com -> 192.168.1.10, 192.168.1.11, 192.168.1.12
mount -t nfs nfs.example.com:/data /mnt/data

# 禁用时需要手工指定多路径
mount -t nfs -o remoteaddrs=192.168.1.10,192.168.1.11 server:/data /mnt/data
```

#### 8. shardview_update_interval - 分片视图更新间隔

**功能作用**：
- 控制存储分片信息的更新频率
- 用于分布式存储系统的元数据同步
- 影响数据一致性和性能优化

**默认值**：60秒  
**取值范围**：30-300秒

**使用场景**：
- **频繁变化**：分片经常调整时使用较短间隔
- **稳定系统**：分片布局稳定时使用较长间隔
- **性能优化**：根据元数据更新开销调整

**配置示例**：
```ini
# 动态分片环境
shardview_update_interval=30

# 标准配置
shardview_update_interval=60

# 稳定环境 - 减少元数据查询
shardview_update_interval=180
```

#### 9. priopity_array_wwns - 优先级WWN数组

**功能作用**：
- 设置存储设备的优先级顺序
- WWN(World Wide Name)是存储设备的唯一标识
- 优先使用列表中的存储设备进行数据传输

**格式**：逗号分隔的WWN列表  
**最大数量**：6个

**使用场景**：
- **存储分层**：优先使用高性能存储设备
- **就近访问**：优先访问本地或近距离存储
- **成本控制**：优先使用低成本存储

**配置示例**：
```ini
# 优先使用高性能SSD存储
priopity_array_wwns=21:00:00:24:ff:7f:4a:01,21:00:00:24:ff:7f:4a:02

# 多存储分层策略
priopity_array_wwns=ssd001,ssd002,sas003,sata004
```

#### 10. local_ip_filters - 本地IP过滤器

**功能作用**：
- 限制ENFS使用的本地网络接口
- 通过IP地址范围控制出站网络流量
- 实现网络隔离和安全策略

**格式**：逗号分隔的IP地址或网段  
**最大数量**：8个

**使用场景**：
- **网络隔离**：限制使用特定网段的接口
- **性能优化**：只使用高带宽网络接口
- **安全策略**：避免通过不安全网络传输

**配置示例**：
```ini
# 只使用高速内网
local_ip_filters=192.168.1.0/24,10.0.0.0/8

# 多网卡环境 - 指定专用存储网络
local_ip_filters=172.16.0.0/16,172.17.0.0/16

# 排除管理网络 - 只使用业务网络
local_ip_filters=10.1.0.0/16,10.2.0.0/16
```

#### 11. lookupcache_interval - 查找缓存间隔

**功能作用**：
- 控制文件/目录查找结果的缓存时间
- 减少重复的网络查找请求
- 平衡性能和数据一致性

**默认值**：60秒  
**取值范围**：30秒-2147483647秒

**使用场景**：
- **频繁访问**：较短缓存时间确保数据新鲜度
- **稳定目录**：较长缓存时间提升性能
- **实时性要求**：根据业务需求调整

**配置示例**：
```ini
# 高实时性要求
lookupcache_interval=30

# 标准配置
lookupcache_interval=60

# 静态文件系统 - 长期缓存
lookupcache_interval=3600
```

#### 12. lookupcache_enable - 查找缓存启用

**功能作用**：
- 全局启用或禁用查找缓存功能
- 影响目录和文件元数据的缓存行为
- 用于性能调优或故障排查

**默认值**：1（启用）  
**取值范围**：0-1

**使用场景**：
- **性能优化**：启用缓存减少网络开销
- **实时性要求**：禁用缓存确保数据最新
- **调试问题**：临时禁用排查缓存相关问题

**配置示例**：
```ini
# 启用缓存提升性能
lookupcache_enable=1

# 禁用缓存确保实时性
lookupcache_enable=0
```

#### 13. link_count_per_mount - 每挂载点链接数

**功能作用**：
- 限制单个NFS挂载点可使用的最大网络连接数
- 控制单个挂载点的资源消耗
- 防止单个挂载点占用过多系统资源

**默认值**：32  
**取值范围**：2-1024

**使用场景**：
- **高并发**：增加连接数提升并发性能
- **资源限制**：减少连接数节约系统资源
- **负载均衡**：根据服务器能力调整

**配置示例**：
```ini
# 高性能服务器
link_count_per_mount=128

# 标准配置
link_count_per_mount=32

# 资源受限环境
link_count_per_mount=8
```

#### 14. link_count_total - 系统总链接数

**功能作用**：
- 限制整个系统的最大网络连接总数
- 防止过多连接耗尽系统资源
- 系统级别的资源保护

**默认值**：512  
**取值范围**：512-16384

**使用场景**：
- **大型系统**：增加总连接数支持更多挂载点
- **嵌入式系统**：减少连接数适应硬件限制
- **云环境**：根据实例规格调整

**配置示例**：
```ini
# 大型服务器
link_count_total=8192

# 标准服务器
link_count_total=512

# 边缘设备
link_count_total=256
```

#### 15. native_link_io_enable - 原生链接IO启用

**功能作用**：
- 启用或禁用原生网络IO优化
- 影响底层网络传输的实现方式
- 可能提供更好的性能或兼容性

**默认值**：1（启用）  
**取值范围**：0-1

**使用场景**：
- **性能优化**：启用获得更好的IO性能
- **兼容性问题**：禁用解决某些网络设备兼容性
- **调试分析**：切换不同实现方式对比性能

**配置示例**：
```ini
# 启用原生IO优化
native_link_io_enable=1

# 兼容模式
native_link_io_enable=0
```

#### 16. create_path_no_route - 无路由创建路径

**功能作用**：
- 控制在无网络路由时是否仍尝试创建连接
- 用于处理网络配置不完整的场景
- 影响连接建立的容错行为

**默认值**：0（禁用）  
**取值范围**：0-1

**使用场景**：
- **动态路由**：启用以处理路由动态变化
- **静态配置**：禁用避免无效连接尝试
- **网络故障恢复**：启用支持网络自愈

**配置示例**：
```ini
# 动态网络环境
create_path_no_route=1

# 静态网络配置
create_path_no_route=0
```

### 3.3 完整配置示例

#### 3.3.1 高性能生产环境配置
```ini
# ENFS高性能生产环境配置
# 适用于高带宽、低延迟的企业网络环境

# 路径检测 - 快速故障发现
path_detect_interval=10
path_detect_timeout=3

# 多路径配置 - 启用所有功能
multipath_disable=0
multipath_timeout=15
multipath_select_policy=roundrobin

# DNS配置 - 支持动态环境
dns_update_interval=5
dns_auto_multipath_resolution=1

# 分片视图 - 标准更新间隔
shardview_update_interval=60

# 缓存配置 - 平衡性能和一致性
lookupcache_enable=1
lookupcache_interval=60

# 连接数配置 - 高并发支持
link_count_per_mount=64
link_count_total=2048

# 性能优化
native_link_io_enable=1
create_path_no_route=0

# 网络配置 - 使用高速存储网络
local_ip_filters=10.1.0.0/16,10.2.0.0/16

# 存储优先级 - 优先使用SSD
priopity_array_wwns=ssd001,ssd002,ssd003
```

#### 3.3.2 云环境配置
```ini
# ENFS云环境配置
# 适用于弹性伸缩的云计算环境

# 路径检测 - 适应云网络特性
path_detect_interval=15
path_detect_timeout=5

# 多路径配置
multipath_disable=0
multipath_timeout=0
multipath_select_policy=roundrobin

# DNS配置 - 频繁更新适应弹性IP
dns_update_interval=2
dns_auto_multipath_resolution=1

# 分片视图 - 较短间隔适应动态扩容
shardview_update_interval=45

# 缓存配置 - 较短缓存适应动态变化
lookupcache_enable=1
lookupcache_interval=30

# 连接数配置 - 中等规模
link_count_per_mount=32
link_count_total=1024

# 云环境优化
native_link_io_enable=1
create_path_no_route=1
```

#### 3.3.3 边缘计算配置
```ini
# ENFS边缘计算配置
# 适用于资源受限的边缘设备

# 路径检测 - 较长间隔节约资源
path_detect_interval=30
path_detect_timeout=10

# 多路径配置 - 基本功能
multipath_disable=0
multipath_timeout=20
multipath_select_policy=roundrobin

# DNS配置 - 减少DNS查询
dns_update_interval=30
dns_auto_multipath_resolution=0

# 分片视图 - 较长间隔节约资源
shardview_update_interval=120

# 缓存配置 - 长时间缓存减少网络请求
lookupcache_enable=1
lookupcache_interval=300

# 连接数配置 - 限制资源消耗
link_count_per_mount=8
link_count_total=128

# 资源节约配置
native_link_io_enable=1
create_path_no_route=0
```

#### 3.3.4 性能调优建议

#### 3.3.5 高IOPS场景
- 减小 `path_detect_interval` 和 `path_detect_timeout`
- 增加 `link_count_per_mount`
- 启用 `native_link_io_enable`
- 使用 `roundrobin` 负载均衡策略

#### 3.3.6 大文件传输场景
- 适当增大 `multipath_timeout`
- 考虑使用 `shardview` 策略
- 增加总连接数 `link_count_total`
- 使用专用存储网络（配置 `local_ip_filters`）

#### 3.3.7 广域网场景
- 增大各种超时参数
- 启用长期缓存
- 减少DNS更新频率
- 启用 `create_path_no_route` 处理网络波动

### 3.4 故障排查

#### 3.4.1 常见问题及配置调整
1. **连接频繁断开**：增大 `path_detect_timeout`
2. **性能不佳**：检查 `link_count_per_mount` 设置
3. **DNS解析问题**：调整 `dns_update_interval` 或禁用 `dns_auto_multipath_resolution`
4. **缓存一致性问题**：减小 `lookupcache_interval` 或禁用缓存

#### 3.4.2 调试配置
```ini
# 故障排查配置 - 禁用优化功能便于分析
multipath_disable=1
lookupcache_enable=0
dns_auto_multipath_resolution=0
native_link_io_enable=0
```

通过合理配置这些参数，可以让ENFS在不同的网络环境和应用场景下发挥最佳性能。