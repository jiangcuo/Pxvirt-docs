# Installation Guide

## ISO Installation
Supported models for ISO installation:

|Architecture|Models|
|-|-|
|x86_64|Generic|
|aarch64|UEFI-compatible development boards or servers, such as Kunpeng 920, Phytium S2500, Ampere|
|loongarch64|3A5000, 3C5000, 3A6000, 3C6000, 3D6000|

::: danger
Loongson 5000 users please use the new-world BIOS
:::

# Download ISO File

Download link: https://download.lierfang.com/isos/

# Burning ISO

You can also use IPMI for remote installation.
>**[warning] Note**
>
>It is recommended to use a good quality USB drive.

## Windows Users

Please download [rufus](https://github.com/pbatard/rufus/releases/download/v4.6/rufus-4.6.exe) as your writing tool, and write in dd mode.

>**[warning] Note**
>
>Do not use ventoy for booting!

## Linux Users

Use the following command to write:

```bash
dd if=/path/to/pxvirt.iso of=/dev/sdX bs=1M status=progress
sync
```
Replace `/path/to/pxvirt.iso` with your ISO path, and `/dev/sdX` with your disk device.

## MacOS Users

```bash
# Check your disks
sudo diskutil list  
# If the disk is mounted, remember to unmount it
sudo diskutil umount /dev/diskXsX
# Write to disk
sudo dd if=/path/to/pxvirt.iso of=/dev/diskXsX bs=1M status=progress
```

Replace `/path/to/pxvirt.iso` with your ISO path, and `/dev/diskXsX` with your disk device.

# Starting the Installer

>Pxvirt currently does not support Secure Boot. Please make sure to disable Secure Boot in the BIOS!

Insert the USB drive into your server or PC. For PCs, insert it into the motherboard side.

During bootup, select USB boot, and you will enter our installation page.

![alt text](../img/install1.png#pic_center)

Here is an explanation of all menu items:

- Install Pxvirt (Automated) `Start unattended installation, requires pre-configured unattended file`
- Install Pxvirt (Graphical) `Use graphical interface for installation, requires a GPU with compatible drivers`
- Install Pxvirt (Terminal UI) `Use text interface for installation, best GPU compatibility, but installation is in text mode`
- Install Pxvirt (Terminal UI, Serial Console) `Use serial port for text interface installation, suitable for devices without a graphics card`
- Advanced Options `Advanced options`
  - Install Pxvirt (Graphical, Debug Mode) `Enter graphical debug mode`
  - Install Pxvirt (Terminal UI, Debug Mode) `Enter text debug mode`
  - Install Pxvirt (Serial Console Debug Mode) `Use serial port for debug mode`
  - Install Pxvirt (Automated) `Start unattended installation`
  
- Rescue Boot `Boot recovery, can be used if PXVIRT's grub is damaged`

## Troubleshooting Boot Issues

This is the Grub page, which doesn't involve the Linux kernel, so it's related to ISO burning.

1. Check if Secure Boot is enabled; it needs to be disabled.
2. Check if you're using an ISO for a different architecture.
3. Check if USB boot was successful.
4. Check if your BIOS is up to date.

If your machine has a UEFI Boot Manager, you can try manually adding the boot entry.
PXVIRT boot paths (case insensitive) are:

|Architecture|Path|
|-|-|
|x86_64|/efi/boot/bootx64.efi|
|aarch64|/efi/boot/bootaa64.efi|
|loongarch64|/efi/boot/bootloongarch64.efi|

# Installation Debugging

For ARM architecture, GRUB takes time to load the installation kernel, and the page may freeze.

## ***EFI_RNG_PROTOCOL unavailable***

Don't panic, this is just a kernel notification, not an error. Please wait patiently.

If you've waited more than 10 minutes and still haven't entered, try the following debugging method:

1. Restart the server and enter the ISO installation page
2. Select the `Install Pxvirt (Graphical, Debug Mode)` option

If you can't enter the debug page, we won't know what happened. It's likely a kernel panic.

If your machine has a serial port, you can:

1. Restart the server and enter the ISO installation page
2. Select the `Install Pxvirt (Serial Console Debug Mode)` option
3. Press 'e'
4. Add `earlycon=ttyS0` at the end of the `linux` line, as shown below

![alt text](../img/install2.png#pic_center)
5. Press `ctrl + x` to boot. You can then view debug information through the serial port or SOL console.

## ***no device with valid ISO found, please check your installation medium***

Please use the disk burning methods described above, and don't use third-party ISOs. If you encounter this problem:

1. Restart the server and enter the ISO installation page
2. Select the `Install Pxvirt (Graphical, Debug Mode)` option
3. Use blkid to check if a USB drive is present

The ISO disk is usually named pxvirt.

## ***No Network Interface found!***

This issue occurs when no network card is detected. If your machine has a network card, it's likely missing a driver. You can:

1. Restart the server and enter the ISO installation page
2. Select the `Install Pxvirt (Graphical, Debug Mode)` option
3. Press `ctrl + d` to continue booting
4. Enter `lspci` and `ip a` to check your current network card. You can send us the results.

If you need to force installation, after step 4, execute the following command to create a virtual network card:
5. `ip tuntap add dev tap0 mode tap`

This will trick the installation program into thinking the system has a network card, as shown below:

![alt text](../img/install3.png#pic_center)

But be aware that this only allows installation. After restarting, you will still have no network.

If you add a network card after installation, you can refer to "Modifying the Network" for changes.

## ***Cannot connect to network after restart***

This is likely because the wrong network card was selected during installation. Simply plug the network cable into a different network card port. You can also refer to "Modifying the Network" for changes.

## ***Package corruption && Input/output error && SQUASHFS error***

Since the Pxvirt installation disk mounts the USB file system, if the USB drive fails or disconnects, it may cause file system crashes. Please check your USB drive or IPMI network.

## ***Cannot enter Xorg graphical interface or display shows white screen/anomalies***

1. Restart the server and enter the ISO installation page
2. Select the `Install Pxvirt (Terminal UI)` option to use text mode installation

