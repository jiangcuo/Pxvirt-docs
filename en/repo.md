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

## LoongARCH spical debian repo

Since there is no official Debian version of loongarch yet and it only exists in sid, we have frozen it. Our packages are all based on this version, so you need to use our repository instead of the official Debian repository.

pxvirt 8

```
deb [trusted=yes] https://debianports.mirrors.lierfang.com/bookworm/ sid main
```

pxvirt 9

```
deb [trusted=yes] https://debianports.mirrors.lierfang.com/trixie/ sid main
```


## Repositories Mirrors


1. Official Site

    - https://mirrors.lierfang.com
    - https://de.mirrors.lierfang.com
    - https://jp.mirrors.lierfang.com
    - https://ah1.cdn.lierfang.com:8000
    - https://mirrors.apqa.cn

2. Community Site
    
    - https://apt.dedi.zone/pxcloud/pxvirt
    - https://mirrors.homelabproject.cc