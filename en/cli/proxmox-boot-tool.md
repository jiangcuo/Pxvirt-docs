# proxmox-boot-tool

This tool can be set to start the kernel, etc

pxvirt has added the kexec startup function in this cli.

kexec can also bypass the bios self-check and quickly restart the kernel. This function will be particularly effective in the server.

```bash
root@pvedevel:~# proxmox-boot-tool kernel list
Manually selected kernels:
None.

Automatically selected kernels:
6.8.12-4-pve
root@pvedevel:~# proxmox-boot-tool kernel kexec 6.8.12-4-pve
press y/Y to continue
```

The above command will restart to the kernel `6.8.12-4-pve`. To prevent accidental operations by users, it is necessary to press y or Y for confirmation before the operation will take place here.
