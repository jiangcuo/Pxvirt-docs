# proxmox-boot-tool

该工具可以设置启动内核等

pxvirt在这个cli中加入了kexec启动的功能。

kexec也可以绕过bios自检，快速的重启内核。这个功能将在服务器中特别有效。

```bash
root@pvedevel:~# proxmox-boot-tool kernel list
Manually selected kernels:
None.

Automatically selected kernels:
6.8.12-4-pve
root@pvedevel:~# proxmox-boot-tool kernel kexec 6.8.12-4-pve
press y/Y to continue
```

如上的命令，将会重启到内核`6.8.12-4-pve`，为了防止用户的误操作，这里需要按一下y或者Y进行确认才会操作。

