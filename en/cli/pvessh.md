# pvessh

`pvessh` is a cluster batch SSH tool.

For example:
```
root@amd1:~# pvessh uname -r
Hosts: 10.13.16.249 10.13.16.244 10.13.16.245
Command: uname -r

10.13.16.249 : 6.8.4-2-pve
10.13.16.244 : 6.1.43-15-rk2312
10.13.16.245 : 6.6.0-6-openeuler
```

This tool traverses all online nodes in the cluster and initiates SSH control, similar to the Ansible shell command. However, we have integrated it into PXVIRT, making it more lightweight than Ansible.

Use `pvessh -h` to view more help information.

