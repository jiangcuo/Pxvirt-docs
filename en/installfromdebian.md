# Installing PXVIRT from Debian

If you cannot install PXVIRT from ISO, you can install it through Debian.

## System Requirements

- PXVIRT 8 -> Debian 12 Bookworm / Armbian Bookworm
- PXVIRT 9 -> Debian 13 Trixie / Armbian Trixie

Other systems based on Debian-Bookworm or Trixie can also be used for installation.

Ubuntu is NOT supported!

## Installation Preparation

1. Add Software Repository

Download GPG key
```
curl -L https://mirrors.lierfang.com/pxcloud/lierfang.gpg -o /etc/apt/trusted.gpg.d/lierfang.gpg
```

Add the repository to the sources list

```
source /etc/os-release
echo "deb  https://mirrors.lierfang.com/pxcloud/pxvirt $VERSION_CODENAME main">/etc/apt/sources.list.d/pxvirt-sources.list
```

2. Modify Hostname

Proxmox-VE services need to resolve IP addresses using hostname. We need to configure the correct hostname.

Assuming your current IP is 10.10.10.10 and hostname is pxvirt

Modify the /etc/hosts file

```bash
127.0.0.1   localhost
# Add hostname information below
10.10.10.10 pxvirt.local pxvirt 

::1         localhost ip6-localhost ip6-loopback
fe00::0     ip6-localnet
ff00::0     ip6-mcastprefix
ff02::1     ip6-allnodes
ff02::2     ip6-allrouters
```

## Install ifupdown2 (Skip if already installed)

PVE uses `ifupdown2` for network configuration. Some distributions might have installed `NetworkManager`, so we need to disable its service.

```bash
systemctl disable NetworkManager
systemctl stop NetworkManager
```

Then execute the commands
```bash
apt update
apt install ifupdown2 -y
```

Configure static IP using ifupdown2. You can check your network interface using `ip link show`
```
root@nas:~# ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp5s0f0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq master vmbr0 state UP mode DEFAULT group default qlen 1000
    link/ether d0:50:99:d1:13:02 brd ff:ff:ff:ff:ff:ff
4: enp5s0f1: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether d0:50:99:d1:13:03 brd ff:ff:ff:ff:ff:ff
```
Assuming the network interface is `enp5s0f0`

```bash
# Edit /etc/network/interfaces.d/enp5s0f0.conf
nano /etc/network/interfaces.d/enp5s0f0.conf
# Enter the following information
auto enp5s0f0
iface enp5s0f0 inet static
      address 10.13.14.109/24
      gateway 10.13.14.254

```
Then restart the machine to ensure the network is properly applied. If the network configuration is incorrect, it might cause installation interruption due to network disconnection, making the machine inaccessible remotely.

## Install PXVIRT

```bash
apt update
apt install proxmox-ve pve-manager qemu-server pve-cluster 
```

## Create Network Bridge

After installation, log in to the web interface at `https://your_ip:8006`. The username is `root`, and the password is your `root` password. Make sure to select `Linux PAM` as the realm.

After logging in, go to the network settings page, delete the original network interface IP, and create a `Linux Bridge`.

The installation is now complete.