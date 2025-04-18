#!/bin/bash
# this script is used to switch between different pxvirt  and proxmox-ve environments
action=$1
arch=$(uname -m)
pxvirt_key="https://mirrors.lierfang.com/proxmox/debian/pveport.gpg"
pve_key="https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/proxmox-release-bookworm.gpg"
deb_mirrors="https://mirrors.tuna.tsinghua.edu.cn"

handle_confirm(){

    read -p "切换到$action 是否确认执行此操作？(y/n): " confirm
    if [ "$confirm" != "y" ]; then
        echo "操作已取消"
        exit 1
    fi
}

os_check(){
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        if [ "$VERSION_CODENAME" != "bookworm" ]; then
            echo "底层系统必须为debian 12"
            exit 1
        fi
    else
        echo "底层系统必须为debian 12"
        exit 1
    fi
}

pxvirt_check(){
    cmd=`dpkg -l|grep pxvirt`
    if [ ! -z "$cmd" ]; then
        echo "pxvirt已安装"
        exit 1
    fi
}

pve_check(){
    cmd=`dpkg -l|grep pxvirt`
    if [ -z "$cmd" ]; then
        echo "pxvirt未安装"
        exit 1
    fi
}

set_mirrors(){
        echo "deb $deb_mirrors/debian/ bookworm main contrib non-free non-free-firmware" > /etc/apt/sources.list
		echo "deb $deb_mirrors/debian/ bookworm-updates main contrib non-free non-free-firmware" >> /etc/apt/sources.list
		echo "deb $deb_mirrors/debian/ bookworm-backports main contrib non-free non-free-firmware" >> /etc/apt/sources.list
		echo "deb $deb_mirrors/debian-security bookworm-security main contrib non-free non-free-firmware" >> /etc/apt/sources.list
        sed -i "/pve/d" /etc/apt/sources.list.d/*
        sed -i "/pxvirt/d" /etc/apt/sources.list.d/*
        sed -i "/enterprise.proxmox.com/d" /etc/apt/sources.list.d/*
}

set_pve_mirrors(){
    if [ ! -f /etc/apt/trusted.gpg.d/proxmox-release-bookworm.gpg ]; then
        curl  -L $pve_key -o /etc/apt/trusted.gpg.d/proxmox-release-bookworm.gpg
    fi
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/pve bookworm pve-no-subscription" > /etc/apt/sources.list.d/pve-no-subscription.list
}

set_pxvirt_mirrors(){
    if [ ! -f /etc/apt/trusted.gpg.d/pveport.gpg ]; then
        curl  -L $pxvirt_key -o /etc/apt/trusted.gpg.d/pveport.gpg
    fi
    echo "deb https://download.lierfang.com/pxcloud/pxvirt bookworm main" > /etc/apt/sources.list.d/pxvirt.list
}

switch_pxvirt(){
    pxvirt_check
    if [ "$arch" != "loongarch64" ]; then
        set_mirrors
    fi
    set_pxvirt_mirrors
    apt update
    apt install -y pxvirt pve-manager=8.3.5-1+port2 qemu-server=8.3.8+port5
}

switch_pve(){
    touch '/please-remove-proxmox-ve'
    apt autoremove -y proxmox-ve pve-manager pve-qemu-kvm
    mkdir /usr/share/proxmox-ve/ -p
    echo "" > "/usr/share/proxmox-ve/pve-apt-hook"
    chmod +x /usr/share/proxmox-ve/pve-apt-hook
    
    set_mirrors
    set_pve_mirrors
    apt update
    apt install -y proxmox-ve
}   


if [ "$action" == "pve" ]; then
    if [ "$arch" == "loongarch64" ] || [ "$arch" == "aarch64" ]; then
        echo "当前系统架构为$arch,不支持切换到pve"
        exit 1
    fi
fi

case $action in
    pxvirt)
    os_check
handle_confirm

        switch_pxvirt
        ;;
    pve)
    os_check
handle_confirm

        switch_pve
        ;;
    *)
        echo "Usage: $0 {pxvirt|pve}"
        exit 1
        ;;  
esac

