# Ceph RDMA 集群

RDMA 可以有效降低CPU的使用率，降低数据的延迟。

要为Ceph启用RDMA，需要有支持RDMA的硬件和交换机。在参考本文档的时候，请先构建好ceph集群。

本方案仅 Ceph的OSD网络走RDMA，而不是全部流量走RDMA。

## 环境介绍

版本: 8.4 openeuler版本

网卡: ConnectX-5

网络信息:
 - pxvirt1: 10.120.121.247/24 -> enp6s16
 - pxvirt2: 10.120.121.245/24 -> enp6s16
 - pxvirt3: 10.120.121.243/24 -> enp6s16

RDMA 网卡只跑存储流量，因此不设置网桥，单独绑定到某个口。


## 注意事项

RDMA 网卡 只有单卡上的网口支持bond，从冗余角度上看，意义不是特别大。卡故障，意味着ceph的一条链路就会断。要确保更多的冗余，则需要多条 cluster网络或者public网络。


## 安装rdma工具包

使用pvessh可以在各个节点上快速安装。
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

## 查看IB状态

使用`ibv_devinfo`可以查看节点上的ib设备

这里可以看到设备，如下面的`rocep6s16`

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

通过命令`show_gids`，查看RDMA设备的GID。下面`ipv4` VER 为`v2`就是我们需要的`gid` 也就是`3`
```
[root@pxvirt1 ~]# show_gids
DEV     PORT    INDEX   GID                                     IPv4            VER     DEV
---     ----    -----   ---                                     ------------    ---     ---
rocep6s16       1       0       fe80:0000:0000:0000:8e2a:8eff:fe88:9b0f                 v1      enp6s16
rocep6s16       1       1       fe80:0000:0000:0000:8e2a:8eff:fe88:9b0f                 v2      enp6s16
rocep6s16       1       2       0000:0000:0000:0000:0000:ffff:0a78:79f7 10.120.121.247          v1      enp6s16
rocep6s16       1       3       0000:0000:0000:0000:0000:ffff:0a78:79f7 10.120.121.247          v2      enp6s16
```


## 配置limit

Ceph需要更多的内存

```bash
tee /etc/security/limits.d/ceph-rdma.conf  > /dev/null <<'EOF'
*       soft    memlock         unlimited
*       hard    memlock         unlimited
EOF
```

同时配置systemd，mon、mgr、osd 三个服务都要（`PrivateDevices=no` 是为了让守护进程能访问 `/dev/infiniband`）：

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

重载一下systemd并重启服务

```
systemctl daemon-reload
systemctl restart ceph-mon@$(hostname) ceph-mgr@$(hostname)
```



## 为ceph 启用rdma

### 使用之前须知！
由于RDMA 需要网卡的设备id和idx，不同的机器配置不同可能不一样，需要每个节点有独立的`ceph.conf`。但是pve会把`/etc/pve/ceph.conf` 软链接到 `/etc/pve/ceph.conf`，一旦你取消了软链接，那么你在UI上将无法友好管理ceph，变得很难用。

因此我们提供3种场景的方案。

### 机器配置相同、网卡相同的场景

这种情况就是你的机器配置: 型号、pcie槽位相同，网卡的型号相同。每台机器的配置都是一样的，

编辑各个节点的`/etc/pve/ceph.conf` 文件，

在`global`区域添加

```
ms_cluster_type =  async+rdma
ms_async_rdma_type = ib
ms_async_rdma_device_name =  rocep6s16
ms_async_rdma_gid_idx = 3
```

`ms_async_rdma_device_name` 这个值就是`ibv_devinfo` 输出的 hca_id。

`ms_async_rdma_gid_idx` 是 GID 索引，决定走 RoCE v1 还是 v2。

### 机器配置不同的场景、网卡相同的场景

此类机器配置不同，网卡一样，因此他们的GID也是一样，我们可以采用udev的方式，固定rdma设备的名称，这样就可以全局配置。

通过命令`udevadm info -a /sys/class/infiniband/{your_device}| grep "node_guid"` 可以查看网卡的`node_guid`

```
[root@pxvirt2 ~]# udevadm info -a /sys/class/infiniband/rocep6s16 |grep "node_guid"
    ATTR{node_guid}=="8c2a:8eff:fe88:9b10"
[root@pxvirt2 ~]# 
```

比如这里是`node_guid`是`8c2a:8eff:fe88:9b10`。我们用这个值来作为udev规则的判断。

创建udev规则

`touch /etc/udev/rules.d/60-rdma-persistent-naming.rules`

填入

```
ACTION=="add", SUBSYSTEM=="infiniband", \
ATTR{node_guid}=="8c2a:8eff:fe88:9b10", \
PROGRAM="rdma_rename %k NAME_FIXED rdma0"
```

`rdma0`就是固定的ib设备名称

修改完成之后,执行重载

```bash
udevadm control --reload
udevadm trigger --subsystem-match=infiniband --action=add
```

可以看到已经成了rdma0了
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

最后在`/etc/pve/ceph.conf`的`global`区域添加

```
ms_cluster_type =  async+rdma
ms_async_rdma_type = ib
ms_async_rdma_device_name =  rdma0
ms_async_rdma_gid_idx = 3
```


### 机器配置不同的场景、网卡不同的场景

pve的ceph 配置他是集中位于`/etc/pve/ceph.conf`中，

```
[root@pxvirt1 ~]# ls -la /etc/ceph/ceph.conf 
lrwxrwxrwx 1 root root 18 Jul 20 15:19 /etc/ceph/ceph.conf -> /etc/pve/ceph.conf
[root@pxvirt1 ~]# 
```

但是不同的节点 rdma的设备名称可能不相同，因此需要删除软连接，随后复制ceph配置文件到本地目录

```
pvessh unlink /etc/ceph/ceph.conf
pvessh cp /etc/pve/ceph.conf /etc/ceph/ceph.conf
```

编辑各个节点的`/etc/ceph/ceph.conf` 文件，

在`global`区域添加

```
ms_cluster_type =  async+rdma
ms_async_rdma_type = ib
ms_async_rdma_device_name =  rocep2s16
ms_async_rdma_gid_idx = 3
```


## 重启集群

## 验证 RDMA

任意节点执行：

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


在 OSD 0 所在节点上看 Ceph 的 RDMA messenger 计数器（tx_bytes/rx_bytes 应持续增长）：

```bash
ceph daemon /var/run/ceph/ceph-osd.0.asok perf dump | grep -A 15 RDMAWorker
```

或看网卡的 RDMA 硬件计数器（mlx5 把 RDMA 流量单独统计）：

```bash
watch -d "ethtool -S enp6s16 | grep -i rdma"
```
