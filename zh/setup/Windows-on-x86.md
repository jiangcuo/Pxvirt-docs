点击 创建虚拟机按钮。

输入对应的Arch。

# General环节
![alt text](../img/setup2.png#pic_center)

# OS环节

![alt text](../img/setup3.png#pic_center)

# System环节

![alt text](../img/setup4.png#pic_center)

>注意，我们这里勾选了Pre-Enroll Keys（安全启动） 和添加了TPM设备
>
>这是因为最新的Windows11需要tpm和安全启动。如果是linux，请不要勾选Pre-Enroll Keys（安全启动）

# Disks环节
![alt text](../img/setup5.png#pic_center)

>这里我们选择NVME 作为磁盘，因为NVME基本上是免驱的。
>
>为什么要免驱，我们会在以后的文档中介绍

# CPU环节
![alt text](../img/setup6.png#pic_center)

随后我们一直下一步就行。

# 修改光驱
分离光驱，将光驱改成IDE2。

PXVIRT默认将scsi2作为光驱，但是Windows没有默认的scsi驱动，会导致iso不能被识别，因此我们需要将光驱改成IDE2。

![alt text](../img/setup8.png#pic_center)

先选中scsi2，再点remove。之后我们再点击添加，选择`cdrom`

![alt text](../img/setup9.png#pic_center)

随后选择IDE，选择ISO即可

![alt text](../img/setup10.png#pic_center)

# 调整启动顺序

![alt text](../img/setup11.png#pic_center)

在`Options`中，选择`Boot Order`，把刚才添加的`IDE2`移到最上面就好。意思为第一启动项为`IDE2`，也就是我们的iso。

这时候就可以对虚拟机进行开机了。

# 开机

当虚拟机开机时，出现Press any key时一定要按一下

![alt text](../img/setup7.png#pic_center)

如果不按的话，就会出现如下的报错

![alt text](../img/setup12.png#pic_center)

请务必按一下，如果没按，请重置一下虚拟机即可。参考下面的按钮

![alt text](../img/setup13.png#pic_center)

之后就和正常安装Windows没区别了

![alt text](../img/setup14.png#pic_center)

当然你需要下载kvm的驱动，才能正常的驱动一些硬件，例如网卡，串口等硬件。请参考资源下载部分