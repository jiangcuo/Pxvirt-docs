# Rockchip soc issues

1. big.LITTLE !

For example, RK3389 RK3588 is a big.little architecture. You have to configure cpu-affinity to make sure that vm use big cores only or little cores only when vcpus > 1.

see https://github.com/jiangcuo/Proxmox-Arm64/issues/59
