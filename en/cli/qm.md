# qm

`qm` stands for `QEMU/KVM Virtual Machine Manager`, which is the CLI for managing KVM virtual machines.

Here we mainly list the parts that `PXVIRT` has modified or added.

# qm list

We have introduced UUID and arch configuration lists to help us manage via API.

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

As shown in the screenshot above, we display the `UUID` and `ARCH` fields. For compatibility with original PVE virtual machines, if a VM doesn't have a UUID, a UUID will be generated. If a VM doesn't have an `ARCH` field, the host architecture will be displayed.

# qm set
This command allows you to configure virtual machine settings, such as CPU model and memory size.

## arch
Specify the architecture of the virtual machine. Available options:

- aarch64
- loongarch64
- x86_64
- riscv64
- ppc64
- s390x

For example, to set the architecture of a virtual machine to `x86_64`:

`qm set 100 --arch x86_64`

## cpu
Set the CPU model of the virtual machine. PXVIRT supports CPU models for ARM, LoongARCH, RISCV64, and PPC architectures.

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

Some CPU models do not support KVM acceleration. The list of models supporting KVM acceleration is as follows. Any model not in this list does not support KVM acceleration.

|Host Architecture|VM Architecture|VM CPU Type|Notes|
|---|---|---|---|
|x86_64|x86_64|All Qemu, intel, amd, host, max|If you are using an AMD host, selecting Intel won't boot, and vice versa|
|aarch64|aarch64|host, max, Kunpeng-920|Kunpeng920 can only be used on Kunpeng hosts, otherwise an error will occur|
|loongarch64|loongarch64|la464, max|Loongson currently implements la464 simulation, La664 is not supported, so host startup is not supported|

`qm set 100 --arch aarch64 --cpu host` specifies that the architecture of VM 100 is `aarch64` with a CPU model of `host`

## machine

Set the machine type of the virtual machine.

|VM Architecture|VM Machine Type|
|---|---|
|x86_64|q35, i440fx|
|arm64|virt|
|loongarch64|virt|
|riscv64|virt|
|ppc64|pseries|
|s390x|s390-ccw-virtio|

`qm set 100 --arch aarch64 --cpu host --machine virt` specifies that VM 100 has an architecture of `aarch64`, a CPU model of `host`, and a machine type of `virt`

## uuid

Specify the UUID of the virtual machine.

`qm set 100 --uuid 5a2c167f-30d1-4f43-8f13-5d8e83f6106f`

## nvme[0-5]

Set up NVME hard disks for the virtual machine. Currently supports up to 6 NVME devices.

`qm set 100 --nvme0 local-lvm:20`

This command will create a `20G` NVME disk for VM `100`, numbered `nvme0`.

## snapshot

This is a boolean value, 1 or 0.

This option enables Qemu's snapshot mode. When enabled, qemu will save any additional disk data to a temporary folder when starting a virtual machine. When the virtual machine shuts down, qemu will delete this temporary data.

This feature can protect virtual machines, implementing a shutdown-restore function.

`qm set 100 --snapshot 1` enables shutdown-restore for VM 100.

## kernel & initrd & append

Set direct kernel access for the virtual machine.

This feature requires that the kernel and initrd are in vztmpl format and located in the vztmpl folder.

For example, if you have a kernel and initrd, name the kernel `6.6.kernel.tar.gz` and the initrd `6.6.initrd.tar.gz`, and move the files to `/var/lib/vz/template/`.

To set the kernel to `6.6.kernel.tar.gz`:

`qm set 100 --kernel local:vztmpl/6.6.kernel.tar.gz` 

To set the initrd to `6.6.initrd.tar.gz`:

`qm set 100 --initrd local:vztmpl/6.6.initrd.tar.gz`

To set the kernel boot parameters to `"root=/dev/sda2 console=ttyS0 earlycon=ttyS0"`:

`qm set 100 --append "root=/dev/sda2 console=ttyS0 earlycon=ttyS0"`

## vga

Set the GPU device for the virtual machine. PXVIRT's default device is `virtio-gpu`.

Added 2 new options:

- ramfb
- mdev

For functionality, refer to [7. GPU Selection](../ui.md#gpu-selection)

`qm set 100 --vga ramfb`

## hostpci[N]

PXVIRT has added a `ramfb` value, which is a boolean.

For functionality, refer to [8. Mdev ramfb Display](../ui.md#mdev-ramfb-display)

`qm set 100 --hostpci0 host=xxxxx,ramfb=1`

## disk clone

This feature allows you to clone a single virtual machine disk using snapshot technology. It has the following parameters:

- ` --disk <string>` The source VMID's disk

- ` --snapname <string>` The source VMID's snapshot

- ` --target-vmid <integer>` The target VMID

- ` --target-disk <string>` Optional parameter, if not specified, it will be the same as the input disk

This feature only supports three disk backends: lvm-thin, zfs, and ceph-rbd.

The following example clones scsi0 from VM 100 to VM 101:

```bash
qm create 100 --scsi0 local-lvm:10 
qm snapshot 100 installoffice
qm create 101
qm disk clone 100 --disk scsi0 --snapname installoffice --target-vmid 101 --target-disk scsi0
```

## gicversion

Set the ARM virtual GIC interrupt version. Only valid in ARM virtual machines.

Available options:
- host
- 2
- 3
- 4 
- max

When the virtual machine is KVM accelerated, the default value is `host`. When the virtual machine is in TCG mode, the default is `max`. Of course, you can force an override.

This feature can be particularly useful when installing ARM versions of Windows.

For example, specify gicversion=2 for Windows 10, gicversion=3 for Windows 11, but the default is recommended.

`qm set 100 --gicversion 3`

## virtualization

Boolean value. Default is no. Whether to enable nested virtualization for ARM virtual machines. Nested virtualization is a feature available in ARM 8.3 and later. Common models like Phytium S2500 S5000C and Kunpeng 920 are ARM 8.3. If the processor doesn't support this feature, forcing it on will prevent the virtual machine from booting.

`qm set 100 --virtualization 1` enables nested virtualization for VM 100.

## noboot

Boolean value. Default is no. Whether to prevent the virtual machine from booting.

`qm set 100 --noboot 1` prevents VM 100 from booting.
