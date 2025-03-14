# pvebcache

`pvebcache`是pxvirt的bcache管理工具。

## create

`pvebcache create `用于将一个磁盘设备变成bcache后端设备。

`pvebcache create /dev/sdb` 将`/dev/sdb`转成bcache设备。

## list

如下可以查看bcache相关的设备。

```bash
root@pvedevel:~# pvebcache list
name       type       backend-dev          cache-dev             state           size            cachemode      
bcache0    backend    sdc                  unknown              Running         80GB            writeback       
nvme0n1    cache      unknown              unknown              Running         32GB            unknown         
root@pvedevel:~# 
```

## stop

停止相关的bcache后端设备

`pvebcache stop bcache0`

## register

重新注册bcache设备

`pvebcache register /dev/sdb`


## cache create

创建cache设备

`pvebcache cache create /dev/nvme0n1p1`

## cache stop

停止cache设备。如果cache设备正在使用，则无法停止。

`pvebcache cache stop /dev/nvme0n1p1`

## cache attach

将cache设备和后端设备绑定

`pvebcache cache attach bcache0 --cache /dev/nvme0n1p1`

## cache detach

将后端设备和缓存设备分离

`pvebcache cache  detach bcache0`

## cache set 

设置后端设备的缓存策略

- cachemode  # 缓存模式
    - writethrough 
    - writeback
    - writearound
    - none
- sequential #顺序id大小，单位为kb
- wb-percent #回写的百分比
- clear-stats #清除统计数据

`pvebcache cache set bcache0 --cachemode writeback --sequential 4096 --wb-percent 20`

如上命令，将bcache0缓存设置为`writeback`，顺序io大小为4M，回写的百分比为20%


