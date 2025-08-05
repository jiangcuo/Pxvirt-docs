# Hardware Requirements


## General Requirements

1. Memory >= 4G, if using SPDK, 8G or more is recommended
2. CPU cores >= 4, higher CPU count can achieve better performance
3. System disk >= 8G, more space needed if installing additional packages like Ceph
4. Network > 100M

## Architecture and Platform

### LoongARCH Architecture

Currently, PXVIRT only supports LoongARCH64 architecture, not LoongARCH32.

Supported processors: 3A5000/3C5000/3D5000/3C5000L/3A6000/3C6000/3D6000/3K3000

For 5000 series, please use New World BIOS!

### AMD64 Architecture

PXVIRT fully supports Zhaoxin processors, Hygon processors, as well as Intel and AMD processors, but does not support 32-bit architecture.

If you need to use IOMMU features, such as PCI passthrough or SPDK userspace NVMe, Intel processors from 22nm or newer are required, and for AMD, Zen2 or newer is recommended.

### ARM64 Architecture

We categorize ARM64 architecture into 2 types:
    - One is general UEFI-booted hardware with standard ACPI implementation
    - The other is special SoC devices, such as Raspberry Pi, RK3588, etc.

#### UEFI Devices

- Kunpeng: kunpeng920 / kunpeng912
- Phytium: FT2000 / S2500 / S5000C / D2000/D3000
- Ampere, such as Ampere® Altra
- And more

These devices can be installed directly using PXVIRT ISO.

#### SBC Series

- Rockchip: RK3389/RK3568/RK3588/RK3576/
- Allwinner: T527 H616
- CIX: CP8180, CD8180
- Broadcom: Raspberry Pi 3, Raspberry Pi 4, Raspberry Pi 5

::: danger

These devices require their own kernel or uboot to boot and cannot be installed using PXVIRT ISO. Even if they use UEFI, like RK3588, their UEFI implementation is incomplete and cannot properly run PXVIRT ISO.

We will not develop ISO adaptations for these devices.

To install PXVIRT, please use Armbian (based on bookworm)/Debian bookworm base system and install PXVIRT through the software repository.

If PXVIRT updates to 9.0, please use Armbian (based on trixie)/Debian trixie and install PXVIRT through the software repository.

:::

::: danger
These devices are compatible with both 32-bit and 64-bit, meaning they can run both arm64 and armhf architecture applications. In some images, armhf is used by default, as in [issues54](https://github.com/jiangcuo/Proxmox-Arm64/issues/54)

Since PXVIRT is a pure 64-bit software package, you need to switch to arm64 to use it.
:::

These platforms have some issues, please refer to the case section of the documentation.

## RISCV64 Architecture
We have released the RISC-V64 version based on Debian 13. You can refer to [Installing PXVIRT from Debian](./installfromdebian.md) to install the RISC-V64 version.

Since most current RISC-V64 SoCs do not support the H extension, KVM hardware acceleration cannot be used, which means QEMU virtual machines cannot be utilized. However, LXC can be used instead.


## Understanding PXVIRT Components

PXVIRT is a derivative branch of Proxmox VE, similar to an application on the Debian operating system, implemented purely in user space.

Of course, for better kernel component control and bug fixes, the Proxmox team maintains a set of kernel packages, which are prepared for x86 hardware.

We can consider PXVIRT as having 2 parts:

1. PXVIRT Software -> User space
2. PXVIRT Linux Kernel -> Kernel space

The kernel can be compiled by yourself, it only handles some low-level scheduling and does not affect our user-space software.

PXVIRT can be installed on kernel 6.1, or on kernel 6.14

### PXVIRT Kernel

PXVIRT uses OpenEuler community kernel version 6.6 as its kernel. The workload of maintaining a kernel is too large, so we directly use their kernel, which also supports some domestic hardware chips, such as Phytium and Hygon.
