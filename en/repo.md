# Software Repository

We provide APT repositories for various architectures.

PXVIRT 8 is based on `debian 12 bookworm`.

## GPG sign key
```
https://download.lierfang.com/pxcloud/pxvirt/pveport.gpg
```

## Quick install
```
curl -L https://download.lierfang.com/pxcloud/pxvirt/pveport.gpg -o /etc/apt/trusted.gpg.d/pveport.gpg
```

## Repositories:

### PXVIRT 8 Main Repo
```
deb https://download.lierfang.com/pxcloud/pxvirt bookworm main
```

### Ceph-19 
* Supports amd64, arm64, loongARCH64
```
deb https://download.lierfang.com/pxcloud/pxvirt bookworm ceph-squid 
```

### Ceph-18
* Supports amd64, arm64
```
deb https://download.lierfang.com/pxcloud/pxvirt bookworm ceph-reef 
```

### Ceph-17
* Supports amd64
```
deb https://download.lierfang.com/pxcloud/pxvirt bookworm ceph-quincy
```


## Proxmox backup server Repositories

RISCV64 AND LOONGARCH64 ONLY
```
deb https://download.lierfang.com/pxcloud/pbs trixie main
```


## Repositories Mirrors


1. Official Site

    - https://mirrors.lierfang.com
    - https://de.mirrors.lierfang.com
    - https://mirrors.apqa.cn


2. Community Site
    
    - https://apt.dedi.zone/pxcloud/pxvirt
    - https://mirrors.homelabproject.cc