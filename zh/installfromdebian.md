# 从debian安装pxvirt

如果无法从ISO中安装pxvirt，那么就可以通过debian安装pxvirt.

## 系统要求

- pxvirt 8 -> debian12 bookworm / armbian bookworm
- pxvirt 9 -> debian13 trixie / armbian trixie

其他的系统 如果是基于debian-bookworm或者trixie也可以安装。

ubuntu不可安装！


## 安装准备

1. 添加软件源

下载gpg
```
curl -L https://mirrors.lierfang.com/pxcloud/lierfang.gpg -o /etc/apt/trusted.gpg.d/lierfang.gpg
```

将软件源添加到list中

```
source /etc/os-release
echo "deb  https://mirrors.lierfang.com/pxcloud/pxvirt $VERSION_CODENAME main">/etc/apt/sources.list.d/pxvirt-sources.list
```

2. 修改主机名

proxmox-ve的服务需要利用hostname解析ip地址。我们需要配置正确的主机名

假设你当前的ip为10.10.10.10，hostname为pxvirt

修改/etc/hosts文件

```bash
127.0.0.1   localhost
# 下面添加hostname信息
10.10.10.10 pxvirt.local pxvirt 

::1         localhost ip6-localhost ip6-loopback
fe00::0     ip6-localnet
ff00::0     ip6-mcastprefix
ff02::1     ip6-allnodes
ff02::2     ip6-allrouters
```

## 安装ifupdown2（如果本机已安装可忽略）

pve使用`ifupdown2`来进行网络配置，可能某些发行版安装了`NetworkManager`，因此我们需要禁用其服务。

```bash
systemctl disable NetworkManager
systemctl stop NetworkManager
```

随后执行命令
```bash
apt update
apt install ifupdown2 -y
rm /etc/network/interfaces.new
```

使用ifupdown2配置静态ip，可以通过`ip link show`查看你的网卡
```
root@nas:~# ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp5s0f0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq master vmbr0 state UP mode DEFAULT group default qlen 1000
    link/ether d0:50:99:d1:13:02 brd ff:ff:ff:ff:ff:ff
4: enp5s0f1: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether d0:50:99:d1:13:03 brd ff:ff:ff:ff:ff:ff
```
假设网卡为`enp5s0f0`

```bash
# 编辑 /etc/network/interfaces
nano /etc/network/interfaces
# 填入下面的信息
auto enp5s0f0
iface enp5s0f0 inet static
      address 10.13.14.109/24
      gateway 10.13.14.254

```

:::danger 重启注意！
如果你配置不正确，重启之后可能无法通过网络连接，确保你可以通过显示器或者串口控制台等方式连接到服务器
:::

随后重启机器，确保网络正常应用，如果网络不对，可能会导致安装的过程中断网，无法远程到机器中。



## 安装pxvirt

```bash
apt update
apt install proxmox-ve pve-manager qemu-server pve-cluster 
```

## 创建网桥

安装好之后，登录web页面，`https://your_ip:8006`，用户名为`root`，密码为你的`root`密码，领域一定要选`Linux PAM`

登录之后在网卡设置页面，删除原来的网卡ip，创建一个`linux brige`网桥。

至此 安装完成