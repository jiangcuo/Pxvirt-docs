# Running ARM 32-bit Guest Machines in PXVIRT

## Background

PXVIRT supports the aarch64 model by default but does not provide support for 32-bit guest machines.

In some scenarios, such as embedded development and software adaptation, building ARM software often requires cross-compilation, which makes testing cumbersome.

To address this situation, we can use PXVIRT to run high-performance 32-bit virtual machines for testing or building purposes.


## Limitations

Only processors with 32-bit EL0 support are compatible, such as Raspberry Pi, RK3588, Huawei H1616, etc. We can check whether this is supported using the following command:

```bash
root@pve:/opt/2# dmesg |grep features
....
[    1.790931] CPU features: detected: 32-bit EL0 Support
....
```

If `32-bit EL0 Support` is present, it is supported. Modern pure 64-bit processors, such as Apple SoC, Kunpeng, etc., do not support this operation.

The principle is to support 32-bit applications in user space.

## Usage

### Using LXC

Let's use Debian armhf as an example.

Visit `https://images.linuxcontainers.org/images/debian/bookworm/armhf/default/` to download the rootfs.tar.xz file and place it in `/var/lib/vz/template/cache`.

Then create an LXC container and select this system:
```bash
root@pve:~# pct config 102
arch: armhf          # This is the armhf architecture.
cores: 1
features: nesting=1
hostname: debian-armhf
memory: 512
net0: name=eth0,bridge=vmbr0,firewall=1,hwaddr=BC:24:11:CC:0A:9B,type=veth
ostype: debian
rootfs: nvme:102/vm-102-disk-0.raw,size=8G
swap: 512
unprivileged: 1
```

After starting the LXC container, you can see it's running armhf in the system:

```bash
root@debian-armhf:~# file /usr/bin/bash
/usr/bin/bash: ELF 32-bit LSB pie executable, ARM, EABI5 version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-armhf.so.3, BuildID[sha1]=01b15ba37906d24f2fed1ea55558833c537330dd, for GNU/Linux 3.2.0, stripped
root@debian-armhf:~# 
```


### Using QEMU

Currently, QEMU only supports the aarch64 architecture and does not support directly running armhf systems. You need to use arm64 EFI + arm64 kernel for booting.

For example, create a Debian 12 arm64 virtual machine, then use debootstrap to install an armhf system to another partition, and modify GRUB to boot the partition where armhf is located.

