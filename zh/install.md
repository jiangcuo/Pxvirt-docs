安装帮助
#以ISO方式的安装
ISO支持的机型。

|架构|机型|
|-|-|
|x86_64|通用|
|aarch64|支持UEFI的开发板或者服务器,如鲲鹏920,飞腾S2500,Apmere|
|loongarch64|3A5000,3C5000,3A6000,3C6000,3D6000|

::: danger
龙芯5000用户请使用新世界BIOS
:::

# 下载ISO文件

下载地址为：https://download.lierfang.com/isos/

# 刻录iso

当然您也可以使用IPMI进行远程安装。
>**[warning] 注意**
>
>建议使用好点的U盘。

##  Windows用户

请下载[rufus](https://github.com/pbatard/rufus/releases/download/v4.6/rufus-4.6.exe)作为写盘工具，并且以dd方式进行写入。

>**[warning] 注意**
>
>请勿使用ventoy进行启动!

##  Linux用户

使用命令进行写入

```bash
dd if=/path/to/pxvirt.iso of=/dev/sdX bs=1M status=progress
sync
```
请将`/path/to/pxvirt.iso`替换成iso路径,`/dev/sdX`换成磁盘介质。

## MacOS用户


```bash
# 查看您的磁盘
sudo diskutil list  
# 如果磁盘在挂载状态，请记住卸载磁盘
sudo diskutil umount /dev/diskXsX
# 写入磁盘
sudo dd if=/path/to/pxvirt.iso of=/dev/diskXsX bs=1M status=progress
```

请将`/path/to/pxvirt.iso`替换成iso路径,`/dev/diskXsX`换成磁盘介质。

# 启动安装程序

>Pxvirt 当前不支持安全启动，请务必确保bios内关闭了安全启动！

请将U盘插入到服务器或者PC，如果PC请插到主板侧。

开机的时候，选择U盘启动，这时您会进入我们的安装页面


![alt text](/img/install1.png#pic_center)

这里我们列出所有的菜单说明

- Install Pxvirt (Automated) `启动无人值守安装，需要配置无人值守文件`
- Install Pxvirt (Graphical) `使用图形界面安装，需要机器有GPU卡，且有兼容驱动`
- Install Pxvirt (Terminal UI) `使用文本界面安装，GPU兼容最好，但是安装时是文本界面`
- Install Pxvirt (Terminal UI, Serial Console) `使用串口，进入文本界面安装，利用串口进行安装，适合机器没有显卡的设备`
- Advanced Options  `高级选项`
  - Install Pxvirt (Graphical, Debug Mode) `进入图形页面debug模式`
  - Install Pxvirt (Terminal UI, Debug Mode) `进入文本页面debug模式`
  - Install Pxvirt (Serial Console Debug Mode) `使用串口,进行debug模式`
  - Install Pxvirt (Automated) `启动无人值守安装`
  
- Rescue Boot `启动修复，如果pxvirt的grub损坏，可以利用这个启动`

## 如果启动不到这个页面，排查方法

这个是Grub的页面，不涉及linux的内核，因此和ISO刻盘有关系。

1. 检查是否开启了安全启动,需要关闭.
2. 是否使用其他架构的iso.
3. 是否U盘启动成功.
4. 检查bios是否是最新.

如果您的机器带UEFI 启动管理器，可以尝试手动添加启动。
PXVIRT的启动路径(不区分大小写)为

|架构|路径|
|-|-|
|x86_64|/efi/boot/bootx64.efi|
|aarch64|/efi/boot/bootaa64.efi|
|loongarch64|/efi/boot/bootloongarch64.efi|

# 安装问题debug

针对ARM架构，GRUB加载安装内核时，需要时间，页面可能会卡主

##  ***EFI_RNG_PROTOCOL unavailable***

请不要惊慌，这只是内核的提示，并不是错误，请耐心等待。

如果等了10多分钟，还未进入，请使用以下方法进行debug

1. 重启服务器，进入iso安装页面
2. 选择`Install Pxvirt (Graphical, Debug Mode)`选项

如果debug页面，无法进去。那我们也无法知道发生了什么？大概率是内核panic了。

此时如果您机器具有串口，您可以选择

1. 重启服务器，进入iso安装页面
2. 选择`Install Pxvirt (Serial Console Debug Mode)`选项
3. 按e
4. 在`linux`行的后面，加上`earlycon=ttyS0`如下图

![alt text](/img/install2.png#pic_center)
5. `ctrl + x`进行启动。之后您可以通过串口或者sol控制台查看到debug信息。


##  ***no device with valid ISO found, please check your installation medium***

请务必用以上的刻盘方式刻录，请勿使用第三方iso。出现这个问题，您可以

1. 重启服务器，进入iso安装页面
2. 选择`Install Pxvirt (Graphical, Debug Mode)`选项
3. 使用blkid查看当前是否有u盘

一般分区iso磁盘名称为pxvirt。

##  ***No Network Interface found!***

这个问题是没有识别到网卡，如果您机器具有网卡，那大概率是没有网卡驱动，您可以

1. 重启服务器，进入iso安装页面
2. 选择`Install Pxvirt (Graphical, Debug Mode)`选项
3. 按`ctrl + d`继续启动
4. 输入`lspci`和`ip a`查看当前的网卡。可以把结果反馈给我们。

如果您需要强制安装，您可以在第四步之后，执行一下命令，生成一个虚拟机的网卡
5. `ip tuntap add dev tap0 mode tap`

这样就可以骗过安装程序，认为当前系统有网卡，如下图

![alt text](/img/install3.png#pic_center)

但您必须清楚，这只是能够安装，重新启动之后，仍会没有网络。

如果您安装好之后，添加了网卡，您可以参考”修改网络“，进行修改。


##  ***重启之后，无法联网***

大概率是因为网口服务器，在安装时，网卡选错了，导致无法联网，只需要把网线换个网卡插就行。您也可以参考”修改网络“，进行修改。


##  ***软件包损坏 && Input/output error && SQUASHFS error***

由于Pxvirt安装盘是挂载的U盘文件系统，如果U盘故障，出现闪断，可能会导致文件系统崩溃，请检测U盘或者ipmi的网络

##  ***Xorg 图形页面进不去或者显示白屏、异常***

1. 重启服务器，进入iso安装页面
2. 选择`Install Pxvirt (Terminal UI) `选项，使用文本模式安装