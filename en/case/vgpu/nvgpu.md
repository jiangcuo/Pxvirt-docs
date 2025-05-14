# Installing Nvidia vGPU in PXVIRT

Note: This guide is only suitable for users who installed PXVIRT via ISO.

The kernel used is pve-kernel-6.x-openeuler.

## Hardware Environment Preparation

- Enable IOMMU, VT-d, SMMU, or SR-IOV I/O virtualization switches in the server BIOS
- Enable IOMMU in PXVIRT

## Enabling IOMMU in PXVIRT

First determine if the system boots through GRUB by running the command `cat /proc/cmdline`. Generally, ZFS boot uses `systemd-boot`, but verification is still necessary.

```
root@node1:~# cat /proc/cmdline 
initrd=\EFI\proxmox\6.6.0-7-openeuler\initrd.img-6.6.0-7-openeuler root=ZFS=rpool/ROOT/pxvirt-1 boot=zfs biosdevname=0 net.ifnames=0
```
If it starts with "initrd" and you don't see "linux kernel", then it's using systemd-boot.

If it looks like below with a `BOOT_IMAGE`, then it's using GRUB:
```
root@amd1:~# cat /proc/cmdline 
BOOT_IMAGE=/boot/vmlinuz-6.6.0-6-openeuler root=/dev/mapper/pve-root ro quiet amd_iommu=on video=vesafb:off video=efifb:off video=simplefb:off pcie_acs_override=downstream
```

Alternatively, run the command below. If there's no error, it's using systemd-boot:
```
cat /etc/kernel/cmdline
```

### Configuring IOMMU for GRUB

```
cat > /etc/default/grub.d/iommu.cfg <<EOF
GRUB_CMDLINE_LINUX="iommu=pt intel_iommu=on amd_iommu=on"
EOF
update-grub
```
Changes will take effect after reboot.

### Configuring IOMMU for systemd-boot
```
sed -i '1s/$/ iommu=pt intel_iommu=on amd_iommu=on/' /etc/kernel/cmdline
proxmox-boot-tool refresh
```

### Verifying IOMMU

```
dmesg |grep -i 'Adding to iommu group'
```
You should see output similar to this:
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

## Installing Components

```
apt update
apt install build-* dkms pve-headers-`uname -r`
```

## Nvidia Driver Compatibility

PXVIRT 8.3 uses 6.6 as its long-term kernel.

Currently, driver versions 16.7 to 18.0 are supported.

## Downloading Nvidia Drivers

Please download drivers from the Nvidia official website.

## Environment Preparation

Nvidia vGPU drivers are incompatible with the `nouveau` driver, so to install vGPU drivers, you need to disable `nouveau`.

### Unloading nouveau

Use the script below to remove the device from `nouveau`:
```
for i in `ls /sys/bus/pci/drivers/nouveau/|grep 00`;do 
    echo $i > /sys/bus/pci/drivers/nouveau/unbind;
done
```

### Permanently Disabling nouveau

```
echo "blacklist nouveau" >> /etc/modprobe.d/blacklist.conf 
echo "blacklist nvidiafb" >> /etc/modprobe.d/blacklist.conf 
update-initramfs -kall -u > /dev/null 2>&1
```
This command will update the kernel parameters. After rebooting, the `nouveau` driver will not load automatically.

It's recommended to reboot before installing the driver.

## Installing Nvidia Drivers

Here we're using `NVIDIA-Linux-x86_64-550.144.02-vgpu-kvm.run` driver, version `17.5`:

```
sh NVIDIA-Linux-x86_64-550.144.02-vgpu-kvm.run \
--dkms -q -s -z \
--no-x-check --no-nouveau-check --no-nvidia-modprobe
```

Explanation of the parameters:
- `--dkms`: Install using DKMS, which will automatically rebuild the driver when upgrading the kernel
- `-q`: Default all popup prompts to yes
- `-s`: Quiet output
- `--no-x-check`: Don't check for X server
- `--no-nouveau-check`: Don't check for the `nouveau` module. This is often suitable for installation, but if `nouveau` still exists, loading the `nvidia` driver will still produce errors
- `--no-nvidia-modprobe`: Don't automatically load the `nvidia` driver after installation. This helps with smooth installation

After installation, you can restart once to ensure the following methods can be executed normally.

## Configuring vGPU Service

For SR-IOV cards like A5000 and later, you need to execute SR-IOV to partition the graphics card. The following command will create a service that partitions all graphics cards at each boot.

If you only want to partition one or a few specific graphics cards, rather than all of them, you can change ALL to the corresponding graphics card number.

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

Start the service:
```
systemctl daemon-reload
systemctl enable nvidia-vgpu-mgr.service 
systemctl enable nvidia-vgpu-sriov.service
systemctl enable nvidia-vgpud.service 
systemctl start nvidia-vgpud.service
systemctl start nvidia-vgpu-mgr.service
systemctl start nvidia-vgpu-sriov.service
```

## Using vGPU in PXVIRT

Select a virtual machine, click Add Device, select RAW Device, and if everything goes well, you should see mdev devices.
