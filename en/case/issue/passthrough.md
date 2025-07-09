# Resource PassThrough

## USB

add usb device on webui

## Disk

do `qm set {vmid} --scsiX /dev/disk/by-id/xxxxxxxx`

## Pcie-device KVM

You need to make sure that your device supports SMMU.
If the device booted via DTB, make sure your PCIe device is already described in DTS and in the IOMMU group. This means that even if your device supports IOMMU, but your PCIe device is not in the IOMMU Group, this still cannot be passthrough.
Pve-port-kernel has enable the iommu.passthrough by default ,So if You device support pcie-passthrough,you will see device in webui.If you are not using pve-port-kernel, try adding iommu.passthrough=1 to the end of the Linux startup command line.
Platform device Passthrough

Below is the iommu-group of the RK3588 device
```
dev@hinlink-h88k:~$ ls /sys/kernel/iommu_groups/*/devices/* -la
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/0/devices/fdab0000.npu -> ../../../../devices/platform/fdab0000.npu
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/10/devices/fdbd0000.rkvenc-core -> ../../../../devices/platform/fdbd0000.rkvenc-core
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/11/devices/fdbe0000.rkvenc-core -> ../../../../devices/platform/fdbe0000.rkvenc-core
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/12/devices/fdc38100.rkvdec-core -> ../../../../devices/platform/fdc38100.rkvdec-core
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/13/devices/fdc48100.rkvdec-core -> ../../../../devices/platform/fdc48100.rkvdec-core
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/14/devices/fdd90000.vop -> ../../../../devices/platform/fdd90000.vop
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/15/devices/av1d-master -> ../../../../devices/platform/av1d-master
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/1/devices/fdb50400.vdpu -> ../../../../devices/platform/fdb50400.vdpu
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/2/devices/fdb60000.rga -> ../../../../devices/platform/fdb60000.rga
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/3/devices/fdb70000.rga -> ../../../../devices/platform/fdb70000.rga
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/4/devices/fdb90000.jpegd -> ../../../../devices/platform/fdb90000.jpegd
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/5/devices/fdba0000.jpege-core -> ../../../../devices/platform/fdba0000.jpege-core
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/6/devices/fdba4000.jpege-core -> ../../../../devices/platform/fdba4000.jpege-core
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/7/devices/fdba8000.jpege-core -> ../../../../devices/platform/fdba8000.jpege-core
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/8/devices/fdbac000.jpege-core -> ../../../../devices/platform/fdbac000.jpege-core
lrwxrwxrwx 1 root root 0 Jan 12 20:28 /sys/kernel/iommu_groups/9/devices/fdbb0000.iep -> ../../../../devices/platform/fdbb0000.iep
```

We can see that they are all platform devices, not PCIe devices. So you can't do Pcie passthrough.But if you want to passthrough the platform device to the virtual machine, you can refer to the link below.

https://cwshu.github.io/arm_virt_notes/notes/vfio/vfio_core2.html

## lxc

add device on webui

