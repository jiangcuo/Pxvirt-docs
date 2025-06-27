## SPDK Introduction

SPDK is a storage acceleration framework. In QEMU applications, it primarily uses vhost to shorten the storage path, thereby improving virtual machine disk performance.

We have integrated SPDK functionality into PXVIRT. Using AIO bdev type, it achieves over 15% performance improvement and 10% latency reduction compared to traditional virtio-scsi implementation.

Main components include:
1. PXVIRT-SPDK -> The main SPDK program, including vhost programs and various spdk_rpc and spdk_cli tools
2. SPDK Perl module -> When a virtual machine starts, it reads `spdk[X]` disk information from the VM configuration file and creates new spdk bdev and vhost controllers. When the VM shuts down, it deletes them

## Known Issues

1. When SPDK disks are present, virtual machines cannot snapshot or perform live migration.
2. SPDK disks cannot be expanded online
3. If spdk bdev is not properly cleaned up when the virtual machine shuts down, the disk may not be deletable.

## Version Requirements

In PXVIRT, QemuServer version must be > 8.3.12, pve-manager > 8.4.1. SPDK support is available as long as you upgrade to versions higher than these.

Note! loongarch64 is currently not supported!

## Configuring SPDK

SPDK's vhost configuration file is located at `/etc/spdk/vhost.conf`
```
cores=0x1       # CPU cores bound to the spdk process
hugemem=2048    # Huge page size used by the spdk process
vhost=/var/tmp  # spdk vhost socket location, this cannot be changed
```

After modifying vhost.conf, you need to restart the pxvirt-spdk service. Note! If virtual machines are currently using the pxvirt-spdk service, restarting it will cause errors with the spdk disks bound to the virtual machines. In severe cases, this may cause virtual machine crashes!

Therefore, before restarting, ensure that no virtual machines are using spdk disks.

## cores CPU Mask Configuration
We can use the cpumask_tool included with the `pxvirt-spdk` software package for conversion.

For example, if you want to bind the spdk process to cores `13-16,50-56`. The syntax here is consistent with taskset.

```bash
root@pvedevel:~#  cpumask_tool -c 13-16,50-56
Hex mask:   0x1fc00000001e000 # mask
Core list:  13-16,50-56
Core count: 11
```

## Huge Pages Configuration

After installing the `pxvirt-spdk` software package, it will create a default grub configuration file `/etc/default/grub.d/spdk.cfg`

The content looks like this:
```bash
cat /etc/default/grub.d/spdk.cfg
GRUB_CMDLINE_LINUX="hugepagesz=2M hugepages=2048 intel_iommu=on iommu=pt amd_iommu=on"
```

We only need to modify the `hugepages=2048` value. The final huge page size is `2M * 2048 = 4096M` huge pages. If you want 8G huge pages, set `hugepages=4096`

Note! After enabling huge pages, this portion will be completely reserved, so you will see the system's available memory decrease. If memory is not sufficient, enabling 2G of huge pages should be adequate.

After modification, run `update-grub` to update. Changes take effect after reboot.

## Using SPDK Disks in PXVIRT

Simply add a disk on the web interface and select SPDK as the type.

If this is your first time using SPDK, make sure the host has applied huge pages. If the host doesn't currently have huge pages enabled, a reboot will be required.

