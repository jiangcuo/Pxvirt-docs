# DirtyFrag


## 受影响范围

普通用户可在pxvirt主机上进行提权。容器默认开启apparmor，不受影响

## 临时解决方案

在主机上

```
echo 'install esp4 /bin/false'  | tee    /etc/modprobe.d/dirtyfrag.conf
echo 'install esp6 /bin/false'  | tee -a /etc/modprobe.d/dirtyfrag.conf
echo 'install rxrpc /bin/false' | tee -a /etc/modprobe.d/dirtyfrag.conf

rmmod esp4 esp6 rxrpc 2>/dev/null

# Drop page caches to have it effected at runtime
echo 3 > /proc/sys/vm/drop_caches 
```

