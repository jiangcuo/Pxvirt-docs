# 软件仓库

PXVIRT 8.3版本使用`debian 12 bookworm`发行。

软件源GPG签名
```
https://mirrors.lierfang.com/pxcloud/pxvirt/pveport.gpg
```

快捷安装签名
```
curl -L https://mirrors.lierfang.com/pxcloud/pxvirt/pveport.gpg -o /etc/apt/trusted.gpg.d/pveport.gpg
```

软件源如下：

PXVIRT 8 主仓库
```
deb https://mirrors.lierfang.com/pxcloud/pxvirt bookworm main
```

Ceph-19 
* 支持amd64 arm64 loongARCH64
```
deb https://mirrors.lierfang.com/pxcloud/pxvirt bookworm ceph-squid 
```

Ceph-18
* 支持amd64 arm64
```
deb https://mirrors.lierfang.com/pxcloud/pxvirt bookworm ceph-reef 
```

Ceph-17
* 支持amd64
```
deb https://mirrors.lierfang.com/pxcloud/pxvirt bookworm ceph-quincy
```

## Proxmox backup server 仓库


```
deb https://mirrors.lierfang.com/pxcloud/pbs trixie main
```

## LoongARCH 特殊的debian仓库

因为loongarch 现在还没有debian的正式版本，存在于sid中，我们对其进行了冻结，我们的包都是基于这个版本，因此需要使用我们的仓库debian仓库。

pxvirt 8

```
deb [trusted=yes check-valid-until=no] https://mirrors.lierfang.com/debian-ports/bookworm/ sid main
```

pxvirt 9

```
deb [trusted=yes check-valid-until=no] https://mirrors.lierfang.com/debian-ports/trixie/ sid main
```


## 仓库镜像


1. 官方镜像

    - https://mirrors.lierfang.com
    - https://us.mirrors.lierfang.com
    - https://jp.mirrors.lierfang.com
    - https://ah1.cdn.lierfang.com:8000

2. 社区镜像
    
    - https://apt.dedi.zone/pxcloud/pxvirt
    - https://mirrors.homelabproject.cc