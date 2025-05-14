# Software Repository

We provide APT repositories for various architectures.

PXVIRT 8 is based on `debian 12 bookworm`.

PXVIRT 9 is based on `debian 13 trixie`.

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