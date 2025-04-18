# 软件仓库

PXVIRT 8.3版本使用`debian 12 bookworm`发行。

PXVIRT 9将使用`debian 13 trixie`发行。

软件源GPG签名
```
https://download.lierfang.com/pxcloud/pxvirt/pveport.gpg
```

快捷安装签名
```
curl -L https://download.lierfang.com/pxcloud/pxvirt/pveport.gpg -o /etc/apt/trusted.gpg.d/pveport.gpg
```

软件源如下：

PXVIRT 8 主仓库
```
deb https://download.lierfang.com/pxcloud/pxvirt bookworm main
```

Ceph-19 
* 支持amd64 arm64 loongARCH64
```
deb https://download.lierfang.com/pxcloud/pxvirt bookworm ceph-squid 
```

Ceph-18
* 支持amd64 arm64
```
deb https://download.lierfang.com/pxcloud/pxvirt bookworm ceph-reef 
```

Ceph-17
* 支持amd64
```
deb https://download.lierfang.com/pxcloud/pxvirt bookworm ceph-quincy
```