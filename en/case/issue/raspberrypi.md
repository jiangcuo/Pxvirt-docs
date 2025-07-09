# RaspberryPi

## kernel pagesize

You should use the Kernel with 4K pagesize.

Please modify cmdline.txt.

Prior to Bookworm, Raspberry Pi OS stored the boot partition at /boot/. Since Bookworm, the boot partition is located at /boot/firmware/.
How to check os release ?
```
cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 11 (bullseye)"
NAME="Debian GNU/Linux"
VERSION_ID="11"
VERSION="11 (bullseye)"
VERSION_CODENAME=bullseye
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

```

```
 cmdline.txt PATH
   Debian Bookworm: /boot/firmware/config.txt
   Debian Bullseye: /boot/config.txt
```
Add in your config.txt `kernel=kernel8.img` and reboot.

https://github.com/jiangcuo/Proxmox-Arm64/issues/65

https://github.com/jiangcuo/Proxmox-Port/issues/65

##  CT notes

In the container summary memory usage and swap usage always shows 0?

Please modify cmdline.txt.

```
cmdline.txt PATH
   Debian Bookworm: /boot/firmware/cmdline.txt
   Debian Bullseye: /boot/cmdline.txt
```
put the following parameters to the end of the line

`cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1`

https://github.com/jiangcuo/Proxmox-Arm64/issues/51

https://github.com/jiangcuo/Proxmox-Port/issues/9

https://github.com/jiangcuo/Proxmox-Port/issues/65

https://github.com/jiangcuo/Proxmox-Port/issues/116