# PXVIRT UI介绍

PXVIRT主要增加了以下功能

#  虚拟机的架构选择

![位于创建虚拟机](/img/arch1.png#pic_center)
    
![位于虚拟选项卡](/img/arch2.png#pic_center)
    
本功能可以调整虚拟机的架构，比如从x86_64架构转换到aarch64架构。

>注意!!!
>
>目前KVM加速只能当前架构，如果从x86_64运行aarch64虚拟机，会使用tcg技术，虚拟机将会很卡。
>
>调整架构之后，虚拟机的配置也要变化，比如CPU型号、主板型号等。不然无法开机。

# 虚拟机的CPU选择

在CPU这里，我们加入了基本上支持的CPU类型。
![](/img/ui3.png#pic_center)

下面是CPU的型号说明

|vendor|所属架构|
|---|---|
|RISCV|riscv64架构所需要的CPU类型|
|POWER|power架构所需要的CPU类型|
|LOONGARCH|LoongARCH架构所需要的CPU类型|
|ARM|aarch64架构所需要的CPU类型|
|intel & AMD| x86_64所需要的cpu类型|

这里还有一些特殊的类型QEMU，我们对QEMU类型进行一次解释

QEMU只有Max 和host是通用类型。也就是max基本上所有的架构都可以选择这个max cpu型号。如果你的主机架构和虚拟机架构一致，选择host或者max，理论上都会进行KVM加速。

现在我们来说一下哪些CPU支持KVM加速。您需要根据您的架构，来正确配置cpu，才能获得最佳的性能。

|主机架构|虚拟机架构|虚拟机CPU类型|备注|
|---|---|---|---|
|x86_64|x86_64|所有的Qemu、intel、amd、host、max|如果你是amd主机，选intel不会开机，反之亦然|
|aarch64|aarch64|host、max、Kunpeng-920|Kunpeng920只能鲲鹏主机使用，否则会报错|
|loongarch64|loongarch64|la464、max|龙芯当前实现了la464的模拟，La664是不支持的，所以不支持host启动|

# 虚拟机的BIOS选择

虚拟机须使用正确的bios，才能正常引导启动。当然这不是绝对，如果你好奇这功能，可以研究一下，在CLI处我们会提到。

|虚拟机架构|虚拟机bios|
|---|---|
|x86_64|all|
|arm64|ovmf|
|loongarch64|ovmf|
|ppc64|seabios|
|s390x|seabios|

# 虚拟机的机型选择

虚拟机必须使用正确的机型，才能正常引导启动。

|虚拟机架构|虚拟机机型|
|---|---|
|x86_64|q35,i440fx|
|arm64|virt|
|loongarch64|virt|
|riscv64|virt|
|ppc64|pseries|
|s390x|s390-ccw-virtio|

# NVME 模拟

在虚拟的磁盘处，我们增加了NVME的模拟，用户可以直接添加nvme磁盘。

![](/img/ui4.png#pic_center)


>提示
>
>好奇NVME的性能吗？我们经过测试，在高并发下nvme比scsi好点，但是日常使用没有性能区别，但是对于Windows来讲，nvme设备就不需要安装scsi驱动了。

>注意
>
>NVME 目前不支持在线迁移！

# GPU选择

我们添加了2种额外的GPU设备。

1. ramfb

这种是机型的ramfb，可以直接输出虚拟机的fb。在arm64下装windows 非常好用。但其他的情况我们不推荐，除非你有特殊的用途

2. Mdev Dispaly(mdev)

这是专门为Mdev 类型的vGPU设计的显示模型，这个型号在Qemu中不存在，支持我们为了让用户更好的使用vGPU而创建的一个管理模型。

当用户使用vGPU时，GPU选择mdev设备，那么PXVIRT将不会添加任何qemu的gpu设备，同时为vGPU开启vfio-pci的Display特性。这样带来的好处就是，用户可以直接通过VNC而去查看vGPU桌面了，而不是禁用qemu显卡，远程访问。

当然该功能需要添加mdev设备。如果没有添加，那么vnc页面将会一直黑屏。

启动之后，搭配vGPU效果如下

![alt text](/img/ui5.png#pic_center)

设备管理器里面，只会有vGPU显卡，实现更好的软件兼容性。

>注意！
>
>先别急着用，Mdev和下面的功能搭配更好

# Mdev的ramfb显示

当你添加vGPU的时候，会显示一个`Ramfb Display`的选项。

![alt text](/img/ui6.png#pic_center)

这个选项将开启vfio-pci的`ramfb`功能，使用这个功能，可以在搭配了vGPU设备的虚拟机中，启用bios画面显示。

![alt text](/img/ui7.png#pic_center)

如果没有开启这个功能，那么虚拟机启动后将会一直黑屏，直到显卡被驱动。因此我们建议使用这个选项。

# 网卡Sriov的支持

我们提供了一个sriov-net-tools，可以快捷开启网卡sriov。我们在UI对网卡 SRIOV进行了增强。当你选择一个SRIOV网卡设备时，你可以在`高级`中配置sriov的mac 和 vlan。固定mac可以防止mac地址变化，在dhcp环境中非常有效。而设置vlan可以更方便的组网。


