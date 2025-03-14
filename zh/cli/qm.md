# qm

`qm` 的意思为 `QEMU/KVM Virtual Machine Manager`，是KVM虚拟机的管理CLI。

我们这里主要列出来我们`PXVIRT`变动或者增加的部分

# qm list

我们引入了UUID和arch的配置清单，以助于我们利用API进行管理。

```bash
root@amd1:~# qm list
      VMID NAME                 uuid                                     ARCH         STATUS     MEM(MB)    BOOTDISK(GB) PID       
       104 pvetest              fa027896-5da0-4fbc-8cd6-2bf7a581e598     x86_64       stopped    2048              32.00 0         
       106 pxvirt               037e68fa-27e4-4a01-a792-e875ee6e28d8     x86_64       running    8192              60.00 687920    
       112 pxvdi-html5          00000000-0000-0000-0000-000000000112     x86_64       stopped    2048              22.00 0         
       144 Proxmox-devel        82df5749-e89b-4928-9e13-57a6c6cf9f58     x86_64       running    16384            120.00 4160394   
       203 WindowsDevel         7a1235be-d626-11ef-b0c5-6b25eae83086     x86_64       stopped    8192             132.00 0         
       300 VM 300               b821ef2b-9fd2-4490-a94e-6eb3399f3480     riscv64      running    8192              60.00 1016619   
      3001 Pxvdi-build          00000000-0000-0000-0000-000000003001     x86_64       stopped    8192               0.00 0         
root@amd1:~# 
```
如上面的截图中，我们展示了`UUID`和`ARCH`字段。为了兼容PVE原本的虚拟机，如果虚拟机没有UUID，将生成一段UUID表示。如果虚拟机没有`ARCH`字段，将显示主机架构。

# qm set
改名了可以设置虚拟机的配置，比如CPU型号，内存大小。

## arch
指定虚拟机的架构 可选值

- aarch64
- loongarch64
- x86_64
- riscv64
- ppc64
- s390x

如设置虚拟机的架构为`x86_64`.

`qm set 100 --arch x86_64`

## cpu
设置虚拟机的cpu型号。PXVIRT支持ARM loongARCH riscv64 ppc架构的cpu模型。

```
'cortex-a35' => 'ARM',
'cortex-a53' => 'ARM',
'cortex-a55' => 'ARM',
'cortex-a57' => 'ARM',
'cortex-a72' => 'ARM',
'cortex-a76' => 'ARM',
'neoverse-n1' => 'ARM',
'neoverse-n2' => 'ARM',
'neoverse-v1' => 'ARM',
'Kunpeng-920' => 'ARM',
'la464_loongarch_cpu' => 'LoongARCH',
'la464' => 'LoongARCH',
'la132' => 'LoongARCH',
'rv64' => 'RISCV', 
'power10' => 'POWER',
'power9' => 'POWER',
'power8' => 'POWER',
'power11' => 'POWER'
```

其中一些CPU模型不支持KVM加速，支持KVM加速的列表如下，不在列表中的均代表 不支持kvm加速。

|主机架构|虚拟机架构|虚拟机CPU类型|备注|
|---|---|---|---|
|x86_64|x86_64|所有的Qemu、intel、amd、host、max|如果你是amd主机，选intel不会开机，反之亦然|
|aarch64|aarch64|host、max、Kunpeng-920|Kunpeng920只能鲲鹏主机使用，否则会报错|
|loongarch64|loongarch64|la464、max|龙芯当前实现了la464的模拟，La664是不支持的，所以不支持host启动|

`qm set 100 --arch aarch64 --cpu host` 指定虚拟机的架构为`aarch64`，cpu模型为`host`

## machine

设置虚拟机的机型。

|虚拟机架构|虚拟机机型|
|---|---|
|x86_64|q35,i440fx|
|arm64|virt|
|loongarch64|virt|
|riscv64|virt|
|ppc64|pseries|
|s390x|s390-ccw-virtio|

`qm set 100 --arch aarch64 --cpu host --machine virt` 指定虚拟机的架构为`aarch64`，cpu模型为`host`,机型为`virt`



## uuid

指定虚拟机的UUID

`qm set 100 --uuid 5a2c167f-30d1-4f43-8f13-5d8e83f6106f`

## nvme[0-5]

设置虚拟机NVME硬盘，目前仅支持6个NVME设备。

`qm set 100 --nvme0 local-lvm:20`

这条命令将会为`100`虚拟机创建一个`20G`大小的nvme磁盘，编号为`nvme0`.

## snapshot

该值是一个布尔值，1 或者 0。

该选项将会开启Qemu的快照模式，当开启此选项后，qemu在启动一个虚拟机的时候，会将增加的磁盘数据保存在临时文件夹中，当虚拟机关机，qemu会删除这些临时数据。

该功能可以保护虚拟机，实现关机还原功能。

`qm set 100 --snapshot 1` 为100虚拟机开启关机还原.

## kernel & initrd & append

为虚拟机设置直接内核访问。

本功能需要内核和initrd以vztmpl格式位于vztmpl文件夹下面。

例如你有一个kernel和initrd，将kernel命名为`6.6.kernel.tar.gz` 将initrd命名为`6.6.initrd.tar.gz`。并将文件移动到`/var/lib/vz/template/`中

设置内核为`6.6.kernel.tar.gz`

`qm set 100 --kernel local:vztmpl/6.6.kernel.tar.gz` 

设置initrd为`6.6.initrd.tar.gz`

`qm set 100 --initrd local:vztmpl/6.6.initrd.tar.gz`

设置内核启动参数为`"root=/dev/sda2 console=ttyS0 earlycon=ttyS0"`

`qm set 100 --append "root=/dev/sda2 console=ttyS0 earlycon=ttyS0"`

## vga

设置虚拟机的GPU设备。PXVIRT默认设备为`virtio-gpu`

增加了下面2个东西。

- ramfb
- mdev

功能参考 [7. GPU选择](../ui.md#gpu选择)

`qm set 100 --vga ramfb`

## hostpci[N]

PXVIRT增加了1个值，`ramfb`.该值为布尔值

功能参考 [8. Mdev的ramfb显示](../ui.md#Mdev的ramfb显示)

`qm set 100 --hostpci0 host=xxxxx,ramfb=1`


## disk clone

该功能可以通过快照技术，克隆单个虚拟机磁盘。具有以下的参数。

- --disk <string>
- --snapname <string>
- --target-vmid <integer>
- --target-disk <string> 可选参数，如果不选，则是和传入的disk一样

该功能仅支持lvm-thin，zfs,ceph-rbd 3种磁盘后端。

下面的示例是将100的scsi0，克隆给了101虚拟机。

```bash
qm create 100 --scsi0 local-lvm:10 
qm snapshot 100 installoffice
qm create 101
qm disk clone 100 --disk scsi0 --snapname installoffice --target-vmid 101 --target-disk scsi0
```


## gicversion

设置ARM虚拟的gic中断版本。仅在ARM虚拟机中有效。

可选值为
- host
- 2
- 3
- 4 
- max

当虚拟机是KVM加速的状态，默认值为`host`,当虚拟机为tcg时,默认为`max`。当然你可以强制覆盖。

该功能可以在安装arm版本的windows比较实用。

例如win10 可以指定gicversion为2，win11 指定为gicversion3，但建议为默认。

`qm set 100 --gicversion 3`

## virtualization

布尔值. 默认为否。是否开启ARM虚拟机的嵌套虚拟。嵌套虚拟是在ARM 8.3之后才有的功能。常见的飞腾S2500 S5000C 鲲鹏920为ARM 8.3。如果处理器不支持该功能，强制启用，虚拟机将无法开机。

`qm set 100 --virtualization 1` 为100虚拟机开启嵌套虚拟

## noboot

布尔值. 默认为否。是否阻止虚拟机启动。

`qm set 100 --noboot 1` 不允许100虚拟开机。
