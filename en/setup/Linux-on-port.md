Install Linux on an arm64/ Loongarch64

# Linux Startup Requirements

PXVIRT uses OVMF (UEFI) as the BIOS of the virtual machine, which means that the virtual machine ISO needs to support UEFI boot to start.

Fortunately, both arm64 and Loongson basically use UEFI, which means ISO, and both support UEFI boot.

Here we take openeuler as an example.

The download link is:

https://www.openeuler.org/zh/download/archive/detail/?version=openEuler%2024.03%20LTS%20SP1

If you are an ARM user, please select aarch64. Loongarch64 users select Loongarch64

# General

If the architecture here is arm64, select aarch64; if it is Loongarch64, select Loongarch64.

If not selected, it will be the architecture of this machine. If you are aarch64 and select loongarch64, you can simulate the Loongson architecture, which will cause performance issues. So you must make the right choice.

![alt text](/img/linux1.png#pic_center)

# OS 

Just select the corresponding ISO here.

![alt text](/img/linux2.png#pic_center)

# System 

![alt text](/img/linux3.png#pic_center)

>**[info] Do not check the Pre-Enroll Keys (Secureboot) and TPM devices**

# Disk

Here, you can select either scsi or nvme. IDE and SATA cannot be selected. virtio-blk is not recommended

![alt text](/img/linux4.png#pic_center)

# CPU

:::danger
Loongarch64 users should select la464, while ARM64 users should select HOST or MAX**
:::

![alt text](/img/linux5.png#pic_center)

# other

next pls!

# boot vm

After starting the virtual machine, install Linux normally.

![alt text](/img/linux6.png#pic_center)