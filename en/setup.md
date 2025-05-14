# First install

Suppose you have completed the installation and are now on the https://xxx:8006 page. You can create the first virtual machine according to our wizard.

# Upload iso

You can click `local`, navigate to `ISO images`, and there is a` upload ` button to upload the iso file

![alt text](/img/setup1.png#pic_center)

# Create first vm

Because PXVIRT is a cross-architecture virtualization platform, although it has made compatibility treatments for different architectures, we still need to pay attention when creating it.

Here we have listed a table in order to be able to create a bootable virtual machine correctly.

|config|x86_64|loongarch64|aarch64|s390x|ppc64|riscv64|
|-|-|-|-|-|-|-|
|Arch|x86_64|loongarch64|aarch64|s390x|ppc64|riscv64|
|Guest OS|any|Linux 6.x-2.6|Linux 6.x-2.6|Linux 6.x-2.6|Linux 6.x-2.6|Linux 6.x-2.6|
|Machine|q35&i440fx|virt|virt|s390-ccw-virtio|pseries|virt|
|Bios|any|OVMF|OVMF|Seabios|Seabios|OVMF|
|Disk|scsi & nvme |scsi & nvme|scsi & nvme|scsi|scsi|scsi|
|Cpu sockets|1 |1|1|1|1|1|
|Cpu Type|max|la464|host|max|power10|max|

Now let's divide it into two situations and put them into practice.

* [Install windows on x86](setup/Windows-on-x86.md)
* [Install Linux on an arm64/ Loongarch64](setup/Linux-on-port.md)