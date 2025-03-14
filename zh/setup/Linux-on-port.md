在ARM64和龙芯架构中安装Linux

# Linux启动要求

PXVIRT使用OVMF（UEFI）作为虚拟机的BIOS，也就是需要虚拟机ISO支持UEFI启动才能启动。

很幸运的事，arm64和龙芯用的基本上都是UEFI，也就是说ISO，都支持UEFI启动的。

这里我们以openeuler为例。

下载地址为：

https://www.openeuler.org/zh/download/archive/detail/?version=openEuler%2024.03%20LTS%20SP1

如果是ARM用户，请选择aarch64。龙芯用户选择Loongarch64

# General 环节

这里架构如果是arm64就选择aarch64，如果是龙芯则选择Loongarch64。

如果不选的话，就是本机的架构。如果你是aarch64，选成了loongarch64就可以模拟龙芯架构，这样会带来性能问题。所以一定要选对。

![alt text](/img/linux1.png#pic_center)

# OS 环节

这里选择对应的ISO即可。

![alt text](/img/linux2.png#pic_center)

# System 环节

![alt text](/img/linux3.png#pic_center)

>**[info] 不要勾选Pre-Enroll Keys（安全启动）和TPM设备**

# Disk 环节

这里选择scsi或者nvme都可以，不能选择IDE和SATA，不推荐选择virtio

![alt text](/img/linux4.png#pic_center)

# CPU 环节

>**[danger] 龙芯用户选择la464，ARM64用户选择HOST或者MAX**
>我这里是arm64的主机，因此选择了HOST。

![alt text](/img/linux5.png#pic_center)

# 其他环节

下一步即可

# 开启虚拟机

开启虚拟机之后，正常安装Linux。

![alt text](/img/linux6.png#pic_center)