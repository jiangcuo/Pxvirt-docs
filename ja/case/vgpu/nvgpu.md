# 在PXVIRT 中安装Nvidia vGPU

注意，本文仅适合通过ISO安装Pxvirt的用户。

内核使用pve-kernel-6.x-openeuler

## 硬件环境准备

- 服务器bios 开启iommu，vt-d 或者smmu 或者sriov等 io虚拟化开关
- PXVIRT 开启iommu

## PXVIRT 开启iommu

请先判断是否通过grub启动，执行命令，`cat /proc/cmdline `，一般来说zfs启动使用`systemd-boot`启动，但还是需要判断

```
root@node1:~# cat /proc/cmdline 
initrd=\EFI\proxmox\6.6.0-7-openeuler\initrd.img-6.6.0-7-openeuler root=ZFS=rpool/ROOT/pxvirt-1 boot=zfs biosdevname=0 net.ifnames=0
```
如果这里是initrd开头的，看不到linux kernel 那么就是systemd-boot启动的。

如果像下面，有个`BOOT_IMAGE`就是grub启动的
```
oot@amd1:~# cat /proc/cmdline 
BOOT_IMAGE=/boot/vmlinuz-6.6.0-6-openeuler root=/dev/mapper/pve-root ro quiet amd_iommu=on video=vesafb:off video=efifb:off video=simplefb:off pcie_acs_override=downstream
```

或者执行下面指令，如果不报错，那么是systemd-boot
```
cat /etc/kernel/cmdline
```

### 针对grub 配置iommu

```
cat > /etc/default/grub.d/iommu.cfg <<EOF
GRUB_CMDLINE_LINUX="iommu=pt intel_iommu=on amd_iommu=on"
EOF
update-grub
```
将重启生效

### 针对systemd-boot 配置iommu
```
sed -i '1s/$/ iommu=pt intel_iommu=on amd_iommu=on/' /etc/kernel/cmdline
proxmox-boot-tool refresh
```

### 验证iommu

```
dmesg |grep -i 'Adding to iommu group'
```
出现下面类似的输出即可
```
root@amd1:~# dmesg |grep -i 'Adding to iommu group'
[    0.389629] pci 0000:00:01.0: Adding to iommu group 0
[    0.389648] pci 0000:00:02.0: Adding to iommu group 1
[    0.389660] pci 0000:00:02.1: Adding to iommu group 2
[    0.389673] pci 0000:00:02.2: Adding to iommu group 3
[    0.389684] pci 0000:00:02.3: Adding to iommu group 4
[    0.389705] pci 0000:00:08.0: Adding to iommu group 5
[    0.389715] pci 0000:00:08.1: Adding to iommu group 5
[    0.389736] pci 0000:00:14.0: Adding to iommu group 6
[    0.389746] pci 0000:00:14.3: Adding to iommu group 6
[    0.389795] pci 0000:00:18.0: Adding to iommu group 7
[    0.389806] pci 0000:00:18.1: Adding to iommu group 7
[    0.389817] pci 0000:00:18.2: Adding to iommu group 7
[    0.389828] pci 0000:00:18.3: Adding to iommu group 7
[    0.389839] pci 0000:00:18.4: Adding to iommu group 7
[    0.389851] pci 0000:00:18.5: Adding to iommu group 7
[    0.389862] pci 0000:00:18.6: Adding to iommu group 7
[    0.389872] pci 0000:00:18.7: Adding to iommu group 7
[    0.389884] pci 0000:01:00.0: Adding to iommu group 8
[    0.389897] pci 0000:02:00.0: Adding to iommu group 9
[    0.389909] pci 0000:03:00.0: Adding to iommu group 10
[    0.389923] pci 0000:04:00.0: Adding to iommu group 5
[    0.389927] pci 0000:04:00.1: Adding to iommu group 5
[    0.389932] pci 0000:04:00.2: Adding to iommu group 5
[    0.389936] pci 0000:04:00.3: Adding to iommu group 5
[    0.389941] pci 0000:04:00.4: Adding to iommu group 5
[    0.389945] pci 0000:04:00.6: Adding to iommu group 5
[    0.389950] pci 0000:04:00.7: Adding to iommu group 5
```


## 安装组件

```
apt update
apt install build-* dkms pve-headers-`uname -r`
```
## Nvidia 驱动兼容性

PXVIRT 8.3 使用6.6 作为长期内核。

目前支持16.7 至 18.0 版本驱动。


## 下载nvidia 驱动

请从Nvdia 官网下载驱动

## 做环境准备

Nvidia-vGPU 驱动和 `nouveau` 驱动不兼容，因此如果要安装vGPU驱动，需要禁用`nouveau`

### 卸载 nouveau

使用下面脚本，将将设备从 `nouveau`中卸载
```
for i in `ls /sys/bus/pci/drivers/nouveau/|grep 00`;do 
    echo $i > /sys/bus/pci/drivers/nouveau/unbind;
done
```

### 永久禁用 nouveau

```
echo "blacklist nouveau" >> /etc/modprobe.d/blacklist.conf 
echo "blacklist nvidiafb" >> /etc/modprobe.d/blacklist.conf 
update-initramfs -kall -u > /dev/null 2>&1
```
这个命令将会更新内核参数，重启之后就不会自动加载`nouveau`驱动了。

在安装驱动之前，建议进行重启。


## 安装Nvidia 驱动

这里我们使用`NVIDIA-Linux-x86_64-550.144.02-vgpu-kvm.run` 驱动，版本为`17.5`

```
sh NVIDIA-Linux-x86_64-550.144.02-vgpu-kvm.run \
--dkms -q -s -z \
--no-x-check --no-nouveau-check --no-nvidia-modprobe
```
这是下面参数的解释：
- `--dkms`使用dkms安装，在以后升级内核时，会自动重新构建驱动
- `-q`  默认所有弹窗提示都为yes
- `-s`  安静输出
- `--no-x-check` 不检查x服务器
- `--no-nouveau-check` 不检查`nouveau`模块，这个往往适合安装，但是如果`nouveau`还存在，加载`nvidia`驱动的时候仍然会报错
- `--no-nvidia-modprobe` 安装结束之后，不自动加载`nvidia`驱动。这个有助于顺利安装

安装之后，可以重启一次，确保下面的方法可以正常的执行。

## 配置vGPU服务

如果是A5000之后的sriov卡，需要执行sriov来切分显卡。下面命令将创建一个服务，在每次开机时，都能为所有显卡进行切分。

如果你只想切分某块或者某几块显卡，而不是全部显卡，你可以把ALL改成对应的显卡编号。

```
cat > /etc/systemd/system/nvidia-vgpu-sriov.service <<EOF
[Unit]
Description=Enable NVIDIA SR-IOV
After=network.target nvidia-vgpud.service nvidia-vgpu-mgr.service
Before=pve-guests.service

[Service]
Type=oneshot
#ExecStartPre=/bin/sleep 5
ExecStart=/usr/lib/nvidia/sriov-manage -e ALL

[Install]
WantedBy=multi-user.target
EOF
```

启动服务。
```
systemctl daemon-reload
systemctl enable nvidia-vgpu-mgr.service 
systemctl enable nvidia-vgpu-sriov.service
systemctl enable nvidia-vgpud.service 
systemctl start nvidia-vgpud.service
systemctl start nvidia-vgpu-mgr.service
systemctl start nvidia-vgpu-sriov.service
```

## 在PXVIRT中使用vGPU

选中一个虚拟机，点击添加设备，选择RAW设备，如果不出意外，medev