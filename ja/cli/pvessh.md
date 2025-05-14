# pvessh

`pvessh`是一个集群批量ssh的工具

例如
```
root@amd1:~# pvessh uname -r
Hosts: 10.13.16.249 10.13.16.244 10.13.16.245
Command: uname -r

10.13.16.249 : 6.8.4-2-pve
10.13.16.244 : 6.1.43-15-rk2312
10.13.16.245 : 6.6.0-6-openeuler
```

该工具会遍历集群在线的节点，并发起ssh控制，类似ansible的shell指令.但我们集成在了pxvirt中，比ansible更加轻量化。

使用`pvessh -h` 可以查看更多的帮助

