# 从 Proxmox VE 迁移

运行以下命令来迁移 Proxmox VE 到 Pxvirt

相关的讨论：[discussions/181](https://github.com/jiangcuo/pxvirt/discussions/181)

```bash
curl -Lf -o /tmp/temp.sh https://raw.githubusercontent.com/jiangcuo/Pxvirt-docs/refs/heads/main/pxvirt-tools.sh
chmod +x /tmp/temp.sh
/tmp/temp.sh pxvirt
```


## 还原到 Proxmox VE

运行以下命令来还原 Pxvirt 到 Proxmox VE

注意目前仅支持 x86_64 架构的 Proxmox VE 还原，其他架构的 Proxmox VE 还原请手动安装

此脚本仍然处于测试阶段，可能会有问题，请谨慎使用，如果遇到问题请与我们联系

```bash
/tmp/temp.sh pve
```
