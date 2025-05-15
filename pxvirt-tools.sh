#!/bin/bash
# this script is used to switch between pxvirt and proxmox-ve environments

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
            echo "底层系统必须为 Debian 12 (bookworm)"
            exit 1
        fi
    else
        echo "底层系统必须为 Debian 12"
        exit 1
    fi
}

pxvirt_check(){
    cmd=$(dpkg -l | grep pxvirt)
    if [ -n "$cmd" ]; then
        echo "pxvirt 已安装，跳过切换。"
        exit 1
    fi
}

pve_check(){
    cmd=$(dpkg -l | grep pxvirt)
    if [ -z "$cmd" ]; then
        echo "pxvirt 未安装，跳过切换。"
        exit 1
    fi
}

set_mirrors(){
    echo "设置 Debian 镜像源为 $deb_mirrors"
    cat > /etc/apt/sources.list <<EOF
deb $deb_mirrors/debian/ bookworm main contrib non-free non-free-firmware
deb $deb_mirrors/debian/ bookworm-updates main contrib non-free non-free-firmware
deb $deb_mirrors/debian/ bookworm-backports main contrib non-free non-free-firmware
deb $deb_mirrors/debian-security bookworm-security main contrib non-free non-free-firmware
EOF
    sed -i "/pve/d" /etc/apt/sources.list.d/* 2>/dev/null || true
    sed -i "/pxvirt/d" /etc/apt/sources.list.d/* 2>/dev/null || true
    sed -i "/enterprise.proxmox.com/d" /etc/apt/sources.list.d/* 2>/dev/null || true
}

set_pve_mirrors(){
    echo "添加 PVE 镜像源"
    if [ ! -f /etc/apt/trusted.gpg.d/proxmox-release-bookworm.gpg ]; then
        curl -L $pve_key -o /etc/apt/trusted.gpg.d/proxmox-release-bookworm.gpg
    fi
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/pve bookworm pve-no-subscription" > /etc/apt/sources.list.d/pve-no-subscription.list
}

set_pxvirt_mirrors(){
    echo "添加 PXVirt 镜像源"
    if [ ! -f /etc/apt/trusted.gpg.d/pveport.gpg ]; then
        curl -L $pxvirt_key -o /etc/apt/trusted.gpg.d/pveport.gpg
    fi
    echo "deb https://download.lierfang.com/pxcloud/pxvirt bookworm main" > /etc/apt/sources.list.d/pxvirt.list
}

switch_pxvirt(){
    echo "开始切换到 PXVirt ..."
    pxvirt_check
    echo "清理旧版 PVE 组件..."
    touch /please-remove-proxmox-ve
    apt purge -y proxmox-ve pve-manager pve-qemu-kvm pve-container pve-firewall pve-ha-manager pve-cluster qemu-server libpve-*
    apt autoremove --purge -y

    echo "设置软件源..."
    if [ "$arch" != "loongarch64" ]; then
        set_mirrors
    fi
    set_pxvirt_mirrors

    echo "更新并安装 PXVirt 组件..."
    apt update
    apt install --allow-downgrades -y pxvirt pve-manager=8.3.5-1+port2 qemu-server=8.3.8+port5

    echo "PXVirt 切换完成"
    dpkg -l | grep -E 'pxvirt|pve-manager|qemu-server'
}

switch_pve(){
    # TODO: 需要充分测试，需要注意 pxvirt 组件的版本
    echo "开始切换回原版 PVE ..."
    touch /please-remove-proxmox-ve
    apt purge -y proxmox-ve pve-manager pve-qemu-kvm pve-container pve-firewall pve-ha-manager pve-cluster qemu-server libpve-*
    apt autoremove --purge -y

    mkdir -p /usr/share/proxmox-ve/
    echo "" > /usr/share/proxmox-ve/pve-apt-hook
    chmod +x /usr/share/proxmox-ve/pve-apt-hook

    set_mirrors
    set_pve_mirrors

    echo "更新并安装原版 PVE..."
    apt update
    apt install -y proxmox-ve

    echo "已切换回 Proxmox VE"
    dpkg -l | grep -E 'proxmox-ve|pve-manager|qemu-server'
}

# 主流程
if [ "$action" == "pve" ]; then
    if [ "$arch" == "loongarch64" ] || [ "$arch" == "aarch64" ]; then
        echo "当前系统架构为 $arch，不支持切换到 pve"
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
