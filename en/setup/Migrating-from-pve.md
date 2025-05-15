# Migration from Proxmox VE

Run the following command to migrate Proxmox VE to Pxvirt

Related discussion: [discussions/181](https://github.com/jiangcuo/pxvirt/discussions/181)

```bash
curl -Lf -o /tmp/temp.sh https://raw.githubusercontent.com/jiangcuo/Pxvirt-docs/refs/heads/main/pxvirt-tools.sh
chmod +x /tmp/temp.sh
/tmp/temp.sh pxvirt
```


## Restore to Proxmox VE

Run the following command to restore Pxvirt to Proxmox VE

Note that currently only Proxmox VE with x86_64 architecture is supported for restore, please install it manually to restore Proxmox VE with other architectures.

This script is still in the testing stage, there may be problems, please use it with caution, if you encounter problems, please contact us!

```bash
/tmp/temp.sh pve
```
