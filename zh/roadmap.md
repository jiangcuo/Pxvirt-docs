TODO: 
--------------
1. [ ] 支持DPDK
2. [x] SPDK
    - [  ] ceph支持spdk后端
    - [  ] spdk raid vg和lv管理
3. 集群增强
    - [ ] 集群健康检查工具,ipmi,stocli,
    - [ ] 集群vip的实现
    - 扩展功能
        - [ ] 基于cephfs的nfs集群
        - [ ] 基于ceph的NvmeOF分布式存储扩展
4. [x] 基于debian 13的Riscv64 版本


Release Notes:
--------------
3.7.2025: PXVIRT 8.4-3

  - 增加对SPDK的支持

14.6.2025: PXVIRT 8.4 

  - WEB UI 和后端支持混合架构集群，例如x86_64/loongarch64/arm64/ 同时管理

  - 添加对兆芯和海光的CPU支持

  - 现在为所有架构默认使用openeuler-6.6内核。并且增加更多的网卡驱动

  - 增加NVME磁盘功能

  - 增加了对eNFS的支持，参考：https://docs.openeuler.org/en/docs/20.03_LTS_SP4/docs/eNFS/enfs-user-guide.html

  - 增加了spice h264的编码设置

  - 在虚拟机配置中增加了uuid参数

  - 支持在离线的节点中也可以显示虚拟机名称。

  - 为riscv64, ppc64, s390x 添加tcg模拟功能

  - Nvidia vGPU可以直接在vnc或者spice中显示其画面

  - 为 pxvditemplate 创建了一个新的单独克隆磁盘的功能`qm disk clone`

  - 增加了root@pam apikey的权限

  - 支持虚拟机关机还原功能. Refer to: https://wiki.qemu.org/Documentation/CreateSnapshot

  - 增强了网卡sriov设备的直通功能，能够在webui上指定网卡sriov的mac地址和vlan

  - 集成了bcache工具，可以创建更好性能的ceph集群
