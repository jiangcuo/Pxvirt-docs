# 初次使用

假设你已经完成了安装，同时进入了https://xxx:8006页面。你可以根据我们的向导创建第一个虚拟机。

# 上传ISO

你可以点击`local`,导航到`ISO images`,有个`upload`按钮即可上传iso文件

![alt text](/img/setup1.png#pic_center)

# 创建第一个虚拟机

因为PXVIRT是跨架构的一个虚拟化平台，虽然对不同架构做了兼容处理，我们在创建时仍然需要注意。

这里我们列出了一个表格，以便能够正确创建可引导的虚拟机，

|配置清单|x86_64|loongarch64|aarch64|s390x|ppc64|riscv64|
|-|-|-|-|-|-|-|
|Arch|x86_64|loongarch64|aarch64|s390x|ppc64|riscv64|
|Guest OS|任意|Linux 6.x-2.6|Linux 6.x-2.6|Linux 6.x-2.6|Linux 6.x-2.6|Linux 6.x-2.6|
|Machine|q35&i440fx|virt|virt|s390-ccw-virtio|pseries|virt|
|Bios|任意|OVMF|OVMF|Seabios|Seabios|OVMF|
|Disk|scsi & nvme |scsi & nvme|scsi & nvme|scsi|scsi|scsi|
|Cpu sockets|1 |1|1|1|1|1|
|Cpu Type|max|la464|host|max|power10|max|

现在我们分为2种情况，进行实践一下。

* [在x86上安装windows](setup/Windows-on-x86.md)
* [在arm64/龙芯上安装Linux](setup/Linux-on-port.md)