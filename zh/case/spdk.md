## SPDK 介绍

SPDK 是一个存储加速框架。在Qemu应用上，主要利用vhost 来缩短存储路径，继而可以提高虚拟机磁盘的性能。

我们为PXVIRT 集成了SPDK功能。采用 AIO bdev 类型，相比传统 virtio-scsi 实现超过 15%的性能提升和 10%的延迟降低。

主要组件为
1. PXVIRT-SPDK -> SPDK的主程序，包含了vhost程序，以及各种spdk_rpc和spdk_cli工具
2. SPDK perl模块 -> 在虚拟机每次开机时，从虚拟机配置文件中读取`spdk[X]`的磁盘信息，创建新的spdk bdev和vhost控制器。虚拟机关机时则进行删除



## 存在的问题

1. 存在spdk磁盘时，虚拟机无法快照、在线迁移。
2. spdk磁盘无法在线扩容
3. 如果虚拟机关机时，spdk bdev没有正确清理，磁盘可能无法被删除。
4. 需要一定的保留内存作为大页。因此在小内存机器上比较浪费内存。这是架构要求，也是使用spdk的前提条件。


## 版本要求

在PXVIRT中 QemuServer版本要 > 8.3.12，pve-manager > 8.4.1 。只要升级到比这个高的版本就支持spdk。

注意！loongarch64当前不支持！


## 配置SPDK

SPDK的vhost配置文件位于`/etc/spdk/vhost.conf`
```
cores=0x1       # 为spdk进程绑定的cpu。
hugemem=2048    # spdk进程使用的大页大小
vhost=/var/tmp  # spdk vhost socket位置，这个不能更改
```

修改vhost.conf之后，需要重启pxvirt-spdk服务。注意！如果虚拟机正在使用pxvirt-spdk服务，那么一旦重启，虚拟机所绑定的spdk 磁盘将会出现错误。严重会导致虚拟机崩溃！

因此如果要重启，务必保证虚拟机没有在使用spdk磁盘。


## cores CPU 掩码配置
我们可以通过`pxvirt-spdk`软件包自带的cpumask_tool进行转换。

例如你想把spdk 进程绑定到`13-16,50-56`这几个核。这里的写法和taskset一致。

```bash
root@pvedevel:~#  cpumask_tool -c 13-16,50-56
Hex mask:   0x1fc00000001e000 # 掩码
Core list:  13-16,50-56
Core count: 11
```

## 大页配置

`pxvirt-spdk`软件包安装后，会默认创建一个grub配置文件`/etc/default/grub.d/spdk.cfg`

如果没有这个文件，如从iso安装，你可以直接创建这个文件，并且使用下面的内容。

内容是这样的
```bash
cat /etc/default/grub.d/spdk.cfg
GRUB_CMDLINE_LINUX="hugepagesz=2M hugepages=2048 intel_iommu=on iommu=pt amd_iommu=on"
```

我们只需要修改`hugepages=2048`这里的值就行，最后的大页是`2M * 2048 =4096M` 大页。如果你要8G大页，就`hugepages=4096`

注意！启用大页之后，这部分会被完全独占，因此你会看到系统的可用内存减少了。如果内存不够大，启用2G内存的大页就可行了。

修改之后`update-grub`进行更新。重启生效

如果你是通过systemd-boot启动，如zfs作为系统盘，那么请将`hugepagesz=2M hugepages=2048 intel_iommu=on iommu=pt amd_iommu=on` 添加到`/etc/kernel/cmdline` 同行的末尾。

如下
```
root@gpu2:~# cat /etc/kernel/cmdline 
root=ZFS=rpool/ROOT/pve-1 boot=zfs   intel_iommu=on hugepagesz=2M hugepages=2048 intel_iommu=on iommu=pt amd_iommu=on
```

最后执行`proxmox-boot-tool refresh` 更新引导

## 在PXVIRT 中使用SPDK磁盘

只要在页面上添加磁盘，类型选择SPDK即可。

如果是初次使用，请务必确保主机应用了大页。如果主机现在没有启用大页，那么需要重启一下的。

