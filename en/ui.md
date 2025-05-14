# PXVIRT UI Features

PXVIRT mainly adds the following features:

## Virtual Machine Architecture Selection

![Located at create virtual machine](/img/arch1.png#pic_center)
    
![Located at the virtual tab](/img/arch2.png#pic_center)
    
This function allows you to adjust the architecture of the virtual machine, such as selecting `aarch64 arch` on an x86_64 host.

>Attention!!!
>
>Currently KVM can only accelerate the current architecture. If you run an aarch64 virtual machine on x86_64, it will use TCG technology, making the virtual machine very slow.
>
>After adjusting the architecture, the VM configuration also needs to change, such as the CPU model and motherboard model. Otherwise, it won't be able to start up.

## CPU Model Selection for Virtual Machines

For CPUs, we have added support for most CPU types.

![](/img/ui3.png#pic_center)

The following is a description of CPU models:

|Vendor|Architecture|
|---|---|
|RISCV|riscv64|
|POWER|power|
|LOONGARCH|LoongARCH|
|ARM|aarch64|
|Intel & AMD|x86_64|

Some special types are from QEMU. Let's explain the QEMU types:

In QEMU, only "max" and "host" are universal types. This means that all architectures can generally choose the "max" CPU model. If your host architecture and virtual machine architecture are the same, choosing either "host" or "max" will theoretically enable KVM acceleration.

Now let's discuss which CPUs support KVM acceleration. You need to configure the CPU correctly according to your architecture to achieve the best performance:

|Host Arch|VM Arch|KVM Model|Note|
|---|---|---|---|
|x86_64|x86_64|Qemu, Intel, AMD, host, max|If you're using an AMD host, Intel won't boot, and vice versa|
|aarch64|aarch64|host, max, Kunpeng-920|Kunpeng920 can only be used on Kunpeng hosts; otherwise, an error will be reported|
|loongarch64|loongarch64|la464, max|Loongson currently implements la464 simulation, which doesn't support La664, so it doesn't support host startup|

## VM BIOS

The virtual machine must use the correct BIOS to boot normally. Of course, this is not absolute. If you're curious about this feature, you can explore it further. We'll mention it in the CLI section.

|VM Arch|VM BIOS|
|---|---|
|x86_64|all|
|arm64|ovmf|
|loongarch64|ovmf|
|ppc64|seabios|
|s390x|seabios|

## VM Machine Model

The virtual machine must have the correct model to boot normally.

|VM Arch|VM Machine Model|
|---|---|
|x86_64|q35, i440fx|
|arm64|virt|
|loongarch64|virt|
|riscv64|virt|
|ppc64|pseries|
|s390x|s390-ccw-virtio|

## NVMe Emulation

For virtual disks, we have added NVMe simulation, allowing users to directly add NVMe disks.

![](/img/ui4.png#pic_center)

>Tips
>
>Curious about NVMe performance? We've conducted tests and found that under high concurrency, NVMe performs slightly better than SCSI. However, there's no noticeable performance difference in daily use. For Windows, NVMe devices don't require SCSI driver installation.

## GPU Models

We have added two additional GPU models:

1. ramfb

This is the ramfb model, which can directly output the framebuffer of the virtual machine. It's very useful for installing Windows on arm64. However, we don't recommend it in other cases unless you have a specific purpose.

2. Mdev Display (mdev)

This is a display model specifically designed for Mdev-type vGPUs, which doesn't exist in standard QEMU. It supports a management model we created to enable users to better utilize vGPUs.

When users utilize vGPU, if the GPU selects the mdev device, PXVIRT won't add any GPU devices for QEMU. At the same time, it will enable the Display feature of vfio-pci for vGPU. The advantage is that users can directly view the vGPU desktop through VNC instead of disabling the QEMU graphics card and accessing it remotely.

Of course, this function requires adding the mdev device. If it's not added, the VNC page will remain black.

After startup, when paired with vGPU, the effect is as follows:

![alt text](/img/ui5.png#pic_center)

In the Device Manager, there will only be vGPU graphics cards, achieving better software compatibility.

>Tips
>
>Don't rush to use it yet. Mdev pairs better with the following functions!

## Mdev Display

When you add a vGPU, an option for 'Ramfb Display' will be displayed.

![alt text](/img/ui6.png#pic_center)

This option will enable the 'ramfb' function of vfio-pci. By using this function, BIOS screen display can be enabled in virtual machines equipped with vGPU devices.

![alt text](/img/ui7.png#pic_center)

If this function is not enabled, the virtual machine will remain black after starting up until the graphics card driver is loaded. Therefore, we recommend using this option.
