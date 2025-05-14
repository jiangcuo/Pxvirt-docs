# pvebcache

`pvebcache` is PXVIRT's bcache management tool.

## create

`pvebcache create` is used to convert a disk device into a bcache backend device.

`pvebcache create /dev/sdb` converts `/dev/sdb` into a bcache device.

## list

The following command can be used to view bcache-related devices.

```bash
root@pvedevel:~# pvebcache list
name       type       backend-dev          cache-dev             state           size            cachemode      
bcache0    backend    sdc                  unknown              Running         80GB            writeback       
nvme0n1    cache      unknown              unknown              Running         32GB            unknown         
root@pvedevel:~# 
```

## stop

Stop a bcache backend device.

`pvebcache stop bcache0`

## register

Re-register a bcache device.

`pvebcache register /dev/sdb`


## cache create

Create a cache device.

`pvebcache cache create /dev/nvme0n1p1`

## cache stop

Stop a cache device. If the cache device is in use, it cannot be stopped.

`pvebcache cache stop /dev/nvme0n1p1`

## cache attach

Bind a cache device to a backend device.

`pvebcache cache attach bcache0 --cache /dev/nvme0n1p1`

## cache detach

Detach a backend device from a cache device.

`pvebcache cache detach bcache0`

## cache set 

Set the cache policy for a backend device.

- cachemode  # Cache mode
    - writethrough 
    - writeback
    - writearound
    - none
- sequential # Sequential I/O size in KB
- wb-percent # Write-back percentage
- clear-stats # Clear statistics

`pvebcache cache set bcache0 --cachemode writeback --sequential 4096 --wb-percent 20`

The above command sets the bcache0 cache to `writeback` mode, with a sequential I/O size of 4MB and a write-back percentage of 20%.


