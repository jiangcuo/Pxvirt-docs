# PXVIRT 

![](/img/logo.png#pic_center)

PXVIRT是Proxmox VE的一个变体，由[梨儿方](https://www.lierfang.com)进行开发和维护。

本文档主要介绍PXVIRT和PVE的不同的地方，以及如何使用PXVIRT的功能

PVE的管理有3个部分组成

1. UI页面
2. 后端
3. API接口

我们主要是对后端进行开发，并丰富API的接口，使开发人员能够轻松的使用PXVIRT功能。

下表是和开源Proxmox VE的功能显著对比

|功能|Proxmox VE|Pxvirt|备注|
|-|-|-|-|
|鲲鹏处理器|不支持|支持||
|飞腾处理器|不支持|支持||
|龙芯处理器|不支持|支持||
|海光处理器|不支持|支持||
|兆芯处理器|不支持|支持||
|Riscv处理器|不支持|支持||
|基于麒麟服务器系统|不支持|支持||
|基于欧拉服务器系统|不支持|支持||
|基于统信服务器系统|不支持|支持||
|长期的LTS更新|不支持|支持||
|硬件资源透传|不支持|支持|Pxvirt支持arm/龙芯的GPU\网卡等设备直通|
|国产AI模型|不支持|支持|Pxvirt支持国产沐曦、华为等GPU/vGPU驱动|

相对于其他的超融合，我们有以下功能

## 计算能力

| 功能点 | PXVIRT |
| --- | --- |
| CPU架构 | 海光、兆芯、鲲鹏、飞腾、龙芯 |
| vCPU绑定/模式 | 支持vCPU绑定，资源限制 |
| NUMA优化 | 支持NUMA优化 |
| 批量创建VM | 虚拟机模板+克隆批量部署 |
| 全生命周期 | 启停/暂停/恢复/删除/快照/备份/还原/迁移 |
| 在线调整规格 | CPU热插拔/内存热插拔/磁盘在线扩展/磁盘热插拔/USB热插拔 |
| VM克隆/镜像 | 支持磁盘完整克隆和链接克隆 |
| VM快照/回滚 | 支持含内存状态的快照，以及回滚 |
| 存储迁移 | 不同存储池在线、离线、不同集群迁移 |
| BIOS/UEFI | 支持BIOS和UEFI双模式，UEFI支持vTPM和安全启动 |
| GPU透传/Live Migration | 支持GPU和PCIe设备透传，支持Nvidia vGPU，沐曦算力卡，摩尔线程vGPU，网卡Sriov透传 |
| 性能监控 | 支持实时查看，历史查看，导出到外部查看器（Graphite/InfluxDB) |
| VMware迁移 | 内置ESXi导入 |
| OVA/OVF导入 | 支持 |

## 存储能力

| 功能点 | PXVIRT |
| --- | --- |
| 分布式存储 | 集成Ceph分布式存储 |
| ZFS | 集成ZFS高性能单机存储 |
| 存储类型覆盖 | Directory/LVM/NFS-RDMA/IP-SAN/FC-SAN、/Ceph/ZFS/Btrfs |
| 混合存储池 | 支持多个Ceph池，cephfs，本地存储混合 |
| QoS | 任意磁盘后端的QOS限制 |
| 磁盘精简配置 | QCOW2/ZFS/Ceph thin provision |
| 可视化管理 | GUI全管理+S.M.A.R.T.+通知系统 |
| 虚拟机备份 | 有PBS备份软件，支持增量+去重备份 |
| 存储在线迁移 | 在线存储迁移 |

## 网络能力

| 功能点 | PXVIRT |
| --- | --- |
| 扁平/VPC网络 | linux网络虚拟机交换机，ovs网络虚拟交换机 |
| VLAN/VXLAN | 支持vlan和xvlan多租户组网 |
| 分布式路由 | SDN EVPN分布式路由 |
| 弹性IP/NAT | SDN NAT+SNAT+Floating IP |
| 安全组/防火墙 | 内置集群、虚拟机双层分布式防火墙 |
| 跨集群大二层 | 内置EVPN+BGP支持跨网 |
| 四网隔离/链路聚合 | 多网口+多Bridge+多VLAN+多bond |

## 信创和高可用

| 功能点 | PXVIRT |
| --- | --- |
| 海光/兆芯 x86 | 兼容 |
| 鲲鹏/飞腾 ARM | 兼容 |
| 龙芯 | 兼容 |
| Riscv | 兼容 |
| 麒麟OS/统信OS | 兼容 |
| 一云多芯多OS | 基于华为openeuler生态，同源异构 |
| 开源 | AGPLv3开源 |
| 管理节点架构 | 多主集群(Multi-Master)<br>Corosync quorum+Watchdog Fencing |
| VM HA | HA Manager 2分钟检测+自动failover |
| 存储HA | Ceph/ZFS多副本+PBS异地 |
| 集群规模 | 推荐1-32台之间 |
| API/SDK | 具有RESTful+JSON Schema等开放api |
| 认证与2FA | 支持PAM/LDAP/AD/OpenID Connect<br>TOTP/WebAuthn 2FA等多种权限管理 |
| 在线升级 | 支持在线小版本升级，大版本升级，业务不停机 |
