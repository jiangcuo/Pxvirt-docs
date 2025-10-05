# 在PXVIRT 中运行 arm 32位 客户机

## 背景

在PXVIRT中，默认支持使用aarch64模型，并未对32位的guest机进行支持。

在某些情况下，例如嵌入式开发，软件适配，需要对arm软件进行构建大多需要交叉编译，且测试麻烦。

针对此种情况，我们通过PXVIRT 来运行高性能的32位虚拟机，进行测试或者构建。


## 限制

仅支持32位el0的处理器支持，例如树莓派，rk3588,华为h1616等，我们可以通过一下命令查看是否支持

```bash
root@pve:/opt/2# dmesg |grep features
....
[    1.790931] CPU features: detected: 32-bit EL0 Support
....
```

如果有支持`32-bit EL0 Support`则支持，现代的最新的处理器都是纯64位的，例如apple soc ，鲲鹏之类的，不支持此操作。

原理就是在用户空间上，支持32位的应用。

## 使用

### 以LXC方式

我们以debian armhf为例。

前往`https://images.linuxcontainers.org/images/debian/bookworm/armhf/default/`下载rootfs.tar.xz 文件，放置到`/var/lib/vz/template/cache`中

随后 创建lxc，选择这个系统，
```bash
root@pve:~# pct config 102
arch: armhf          #这里是armhf 架构。
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

随后启动lxc，在系统里面可以看到是armhf

```bash
root@debian-armhf:~# file /usr/bin/bash
/usr/bin/bash: ELF 32-bit LSB pie executable, ARM, EABI5 version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-armhf.so.3, BuildID[sha1]=01b15ba37906d24f2fed1ea55558833c537330dd, for GNU/Linux 3.2.0, stripped
root@debian-armhf:~# 
```


### 以QEMU方式

目前Qemu 仅支持aarch64架构，不支持直接启用armhf系统。需要使用 arm64的efi + arm64的kernel 启动。

例如，创建一个debian12的arm64虚拟机，然后debootstrap 一个armhf的系统 到另外一个分区，再修改grub 引导 armhfs所在的分区即可。


