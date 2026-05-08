# DirtyFrag


## Affected Scope

Unprivileged users can escalate privileges on a pxvirt host. Containers have AppArmor enabled by default and are not affected.

## Temporary Workaround

On the host:

```
echo 'install esp4 /bin/false'  | tee    /etc/modprobe.d/dirtyfrag.conf
echo 'install esp6 /bin/false'  | tee -a /etc/modprobe.d/dirtyfrag.conf
echo 'install rxrpc /bin/false' | tee -a /etc/modprobe.d/dirtyfrag.conf

rmmod esp4 esp6 rxrpc 2>/dev/null

# Drop page caches to have it effected at runtime
echo 3 > /proc/sys/vm/drop_caches 
```

