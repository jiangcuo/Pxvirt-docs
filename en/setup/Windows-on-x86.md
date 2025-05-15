# Installing Windows on x86

Click the Create Virtual Machine button.

Enter the corresponding architecture.

# General Section
![alt text](/img/setup2.png#pic_center)

# OS Section

![alt text](/img/setup3.png#pic_center)

# System Section

![alt text](/img/setup4.png#pic_center)

>Note that we have checked Pre-Enroll Keys (Secure Boot) and added a TPM device
>
>This is because the latest Windows 11 requires TPM and Secure Boot. For Linux, please do not check Pre-Enroll Keys (Secure Boot)

# Disks Section
![alt text](/img/setup5.png#pic_center)

>Here we select NVME as the disk, because NVME is essentially driver-free.
>
>We will explain why driver-free is important in future documentation

# CPU Section
![alt text](/img/setup6.png#pic_center)

Then we simply continue with Next Step.

# Modifying the Optical Drive
Detach the optical drive and change it to IDE2.

PXVIRT defaults to using scsi2 as the optical drive, but Windows doesn't have default SCSI drivers, which means the ISO won't be recognized. Therefore, we need to change the optical drive to IDE2.

![alt text](/img/setup8.png#pic_center)

First select scsi2, then click remove. After that, click Add and select `cdrom`

![alt text](/img/setup9.png#pic_center)

Then select IDE and choose the ISO

![alt text](/img/setup10.png#pic_center)

# Adjusting Boot Order

![alt text](/img/setup11.png#pic_center)

In `Options`, select `Boot Order`, and move the `IDE2` we just added to the top. This means the first boot device is `IDE2`, which is our ISO.

Now you can start the virtual machine.

# Starting the VM

When the virtual machine starts, make sure to press a key when you see "Press any key"

![alt text](/img/setup7.png#pic_center)

If you don't press a key, you'll see the following error

![alt text](/img/setup12.png#pic_center)

Be sure to press a key. If you missed it, simply reset the virtual machine. Refer to the button below

![alt text](/img/setup13.png#pic_center)

After that, it's no different from a normal Windows installation

![alt text](/img/setup14.png#pic_center)

Of course, you'll need to download KVM drivers to properly support some hardware, such as network cards, serial ports, and other devices. Please refer to the Resources Download section