# 从openeuler 中安装pxvirt

Pxvirt 支持从rhel系列的系统安装，以openeuler 24.03 为底座，支持麒麟v11、麒麟信安9等新版本的服务器操作系统

## 系统准备

### 关闭selinux

```bash
echo "SELINUX=disabled" > /etc/selinux/config
```

### 启用apparmor

```bash
vi /etc/default/grub
```

在`GRUB_CMDLINE_LINUX`行，修改`apparmor=0`改成`apparmor=1`

随后更新grub

```bash
grub2-mkconfig -o /boot/efi/EFI/openEuler/grub.cfg
```

之后可以重启验证，如下面apparmor是1 启用状态

```bash
[root@pxvirt ~]# cat /proc/cmdline
BOOT_IMAGE=/vmlinuz-6.6.0-132.0.0.111.oe2403sp3.aarch64 root=/dev/mapper/openeuler-root ro rd.lvm.lv=openeuler/root rd.lvm.lv=openeuler/swap cgroup_disable=files apparmor=1 crashkernel=1024M,high smmu.bypassdev=0x1000:0x17 smmu.bypassdev=0x1000:0x15 arm64.nopauth nospectre_bhb console=tty0
[root@pxvirt ~]#

```

selinux为关闭状态

```bash
[root@pxvirt ~]# getenforce
Disabled
[root@pxvirt ~]#
```
### 关闭防火墙

```bash
systemctl stop firewalld
systemctl disable firewalld
```

### 修改主机名

proxmox-ve的服务需要利用hostname解析ip地址。我们需要配置正确的主机名

假设你当前的ip为10.10.10.10，hostname为pxvirt

修改/etc/hosts文件

```bash# Loopback entries; do not change.
# For historical reasons, localhost precedes localhost.localdomain:
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
# See hosts(5) for proper format and other examples:
# 192.168.1.10 foo.example.org foo
# 192.168.1.13 bar.example.org bar
10.10.10.10 pxvirt.local pxvirt
```

## 安装Pxvirt

### 配置Pxvirt 软件源

```bash
sudo tee /etc/yum.repos.d/pxvirt.repo > /dev/null <<'EOF'
[pxvirt]
name=Lierfang PxVirt Repo
baseurl=https://ah1.mirrors.lierfang.com:8000/pxcloud/pxvirt/repo/openeuler/24.03/$basearch
enabled=1
gpgcheck=1
gpgkey=https://ah1.mirrors.lierfang.com:8000/pxcloud/lierfang.gpg
username=testuser
password=testusertestuser
EOF
```

请将username 和password 改成属于我们提供的账号密码

### 安装Pxvirt

执行

```bash
dnf makecache
dnf install pxvirt libknet1-crypto-nss-plugin ceph -y
```

出现如下

```bash
[root@pxvirt ~]# dnf makecache
OS                                                                                  3.4 kB/s | 1.6 kB     00:00
everything                                                                          3.6 kB/s | 1.7 kB     00:00
EPOL                                                                                3.9 kB/s | 1.8 kB     00:00
debuginfo                                                                           3.5 kB/s | 1.7 kB     00:00
source                                                                              3.5 kB/s | 1.6 kB     00:00
update                                                                              4.8 kB/s | 2.2 kB     00:00
update-source                                                                       3.5 kB/s | 1.6 kB     00:00
Lierfang PxVirt Repo                                                                690 kB/s | 3.0 kB     00:00
Metadata cache created.
[root@pxvirt ~]# dnf install pxvirt
Last metadata expiration check: 0:00:06 ago on 2026年06月01日 星期一 09时06分08秒.
Dependencies resolved.
====================================================================================================================
 Package                            Architecture   Version                                  Repository         Size
====================================================================================================================
Installing:
 proxmox-ve                         noarch         8.4.1-1                                  pxvirt            6.7 k
Installing dependencies:
 CUnit                              aarch64        2.1.3-25.oe2403sp3                       OS                 88 k
 SDL                                aarch64        1.2.15-42.oe2403sp3                      OS                127 k
 abseil-cpp                         aarch64        20230802.1-6.oe2403sp3                   OS                479 k
 alsa-lib                           aarch64        1.2.10-4.oe2403sp3                       update            433 k
 babeltrace                         aarch64        1.5.11-2.oe2403sp3                       OS                194 k
 bcache-tools                       aarch64        1.1-4.oe2403sp3                          everything         44 k
 bridge-utils                       aarch64        1.7.1-4.oe2403sp3                        OS                 30 k
 cdparanoia-libs                    aarch64        10.2-32.oe2403sp3                        OS                 44 k
 ceph-common                        aarch64        2:18.2.2-11.oe2403sp3                    update             18 M
 ceph-fuse                          aarch64        2:18.2.2-11.oe2403sp3                    update            720 k
 cifs-utils                         aarch64        7.0-5.oe2403sp3                          OS                 68 k
 cmake-filesystem                   aarch64        3.27.9-8.oe2403sp3                       OS                8.0 k
 corosync                           aarch64        3.1.10-1.pve2                            pxvirt            261 k
 corosynclib                        aarch64        3.1.10-1.pve2                            pxvirt             43 k
 cstream                            aarch64        4.0.0-1                                  pxvirt             31 k
 dtach                              aarch64        0.9-1                                    pxvirt             24 k
 dtc                                aarch64        1.7.2-3.oe2403sp3                        OS                101 k
 ebtables                           aarch64        2.0.11-13.oe2403sp3                      OS                 77 k
 emacs-filesystem                   noarch         1:29.1-8.oe2403sp3                       update            3.5 k
 extjs                              noarch         7.0.0-5                                  pxvirt            3.4 M
 fmt                                aarch64        8.1.1-1.oe2403sp3                        OS                 97 k
 fonts-font-awesome                 noarch         4.7.0-1
```

### 配置网桥网络

修改网络之前，请确保你能通过ipmi访问或者能够有显示器连接到物理机。

现在Web UI 上配置网络，点击应用

### 禁用NetworkManager

pve使用`ifupdown2`来进行网络配置，rhel系列系统一般模式安装了`NetworkManager`，因此我们需要禁用其服务。

```bash
systemctl disable NetworkManager
systemctl stop NetworkManager
```

重启主机即可！