# 硬件要求


## 通用要求

1. 内存 >=4G ，如果使用spdk或者spdk，建议8G以上
2. CPU数量 >=4， 较高的cpu数量可以获得更好的性能
3. 系统硬盘 >= 8G ，如果需要安装其他的软件包，如ceph，需要更大的空间。
4. 网络 > 100M.

## 架构和平台

### LoongARCH 架构

目前PXVIRT 只支持LoongARCH64 架构，不支持LoongARCH32.

支持的处理器为3A5000/3C5000/3D5000/3C5000L/3A6000/3C6000/3D6000/3K3000

对于5000系列，请使用新世界bios！

### AMD64架构

PXVIRT 全面支持兆芯处理器、海光处理器、以及intel、amd处理器，但不支持32位架构。

如果需要使用iommu功能，如直通，SPDK 用户态NVME等，需要intel 22nm以上处理器，amd建议zen2以上。


### ARM64架构

ARM64架构我们分为2类:
    - 一种是通用的UEFI引导的硬件，这类硬件有比较标准的acpi实现。
    - 另外一种是特殊的soc设备，例如树莓派，rk3588这种。

#### UEFI 设备

- 鲲鹏kunpeng920 / kunpeng912
- 飞腾FT2000 / S2500 / S5000C / D2000/D3000
- Ampere，如Ampere® Altra
- 等等等

此类设备只需要通过PXVIRT ISO安装即可。

#### SBC系列

-  瑞芯微： RK3389/RK3568/RK3588/RK3576/
-  全志：T527 H616
-  CIX：CP8180、CD8180
-  博通： 树莓派3 树莓派4 树莓派5

::: danger

此类设备 需要使用他们的 内核 或者uboot才能启动，不能使用PXVIRT ISO进行安装。即便他们使用了UEFI，例如RK3588，但是这类UEFI并不完整，并不能正常运行PXVIRT ISO.

我们也不会去做此类设备的ISO适配。

如果要安装pxvirt，请使用armbian(基于bookworm)/debian bookworm基础系统，通过软件源安装PXVIRT

如果pxvirt更新到9.0，那么请使用armbian(基于trixie)/debian trixie，通过软件源安装PXVIRT

:::

::: danger
这些设备是兼容32位和64位的，也就是他们可以同时运行arm64 和 armhf 架构的应用。在某些镜像中，默认使用armhf,如[issues54](https://github.com/jiangcuo/Proxmox-Arm64/issues/54)

而PXVIRT是纯64位的软件包，因此需要切换到arm64才能使用。
:::


这类平台还有一些issue，请参考文档case的部分。


##  认识PXVIRT 的组成

PXVIRT 是基于Proxmox VE 的一个衍生分支，类似位于debian操作系统上的一个应用，他纯用户态的实现。

当然为了更好的控制内核组件和进行bug修复，Proxmox 团队维护了一套内核包，这个为x86 硬件准备的。

我们可以认为PXVIRT 有 2 个部分，

1. PXVIRT 软件 -> 用户态
2. PXVIRT Linux 内核 -> 内核态

其中内核可以自己编译的，他只负责一些底层调度，并不影响我们的用户态软件。

PXVIRT 可以安装到6.1 内核上，也可以安装到 6.14 内核上

### PXVIRT 内核

PXVIRT 使用openeuler的社区内核 6.6版本作为内核。 维护内核的工作量太大，我们直接使用其内核，并且支持了一些国产上的硬件芯片，例如飞腾、海光。
