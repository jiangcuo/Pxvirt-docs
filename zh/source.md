# 源码使用
Pxvirt 作为Proxmox VE的二次开发版本，使用AGPL V3 协议进行开源，遵循开源规范，本栏目讲述本项目源码的获取。

本项目默认为同源异构，源码和构建工具不区分架构，支持arm64 、amd64、loongarch64 3个架构，如需构建，需要在对应的架构中构建，而不能交叉构建。


## Pxvirt base debian

基于debian构建的pxvirt 源码全部位于 https://github.com/jiangcuo/pxvirt 中

针对pxvirt 8 ，源码分支位于 pxvirt8 。

### 源码结构

#### docker

这里是方便构建软件包的docker镜像目录
我们提供线上的docker镜像：
- harbor.lierfang.com/pxvirt/pxvirt-builder-bookworm
    
    针对pxvirt8构建

- harbor.lierfang.com/pxvirt/pxvirt-builder-trixie
    
    针对pxvirt9构建
        
#### build.sh

统一的包构建脚本

可以这样去构建构建某个软件包。

```
BUILDERNAME=harbor.lierfang.com/pxvirt/pxvirt-builder-bookworm bash build.sh  pixman
```

#### packages

这是pxvirt所需要的包源码目录，每个源码包都固定为以下的格式，以pixma为例
    
    - pixman
         - pixman ->这里是项目的源码
         - autobuild.sh -> 通用或者自定义的构建脚本
         - patches -> 源码的构建补丁
         - series ->源码的构建补丁的索引




## Pxvirt base openeuler

基于openeuler构建的pxvirt 源码全部位于 https://gitea.lierfang.com/pxcloud/proxmox-rpms.git 中

源码结构和构建方法，已经在对应的仓库中介绍

### docker

我们提供openuler版本构建docker

harbor.lierfang.com/pxvirt/pxvirt-builder-24.03

## ISO打包

ISO的打包sdk均位于https://github.com/jiangcuo/pve-iso-builder.git

仓库有多个分支

其中  `pxvirt` 为debian版本的构建，`openeuler`为openeuler版本构建

如果需要构建iso，需要在对应的主机上构建，如果是openeuler版本，就要在openeuler 版本中构建

### 构建方法

`bash build.sh` 即可构建最新的软件包

### 添加软件包

编辑脚本`build.sh` 在`extra_pkg`变量中添加自己的软件包即可


## 内核构建

内核仓库位于https://github.com/jiangcuo/pve-port-kernel/

内核不区分debian还是openeuler分支，均位于openeuler-6.6 分支

### 内核结构

#### debian

属于debian包的控制文件，以及项目的补丁和内核配置

##### 内核配置文件

配置文件位于 debian/config/ 

针对架构的特殊配置文件位于`arch.kconfig`中，如`arm64.kconfig`

针对通用的配置文件位于`common.kconfig`，如果要修改通用的内核配置，则修改这个文件

##### 内核补丁

补丁文件位于 debian/patches

series.linux 是针对linux kernel的补丁索引
series.zfs 是针对zfs的补丁索引

如需添加补丁，需要把补丁放入对于目录，随后在series文件内引用即可。


#### linux

属于openeuler 上游6.6分支的子模块链接。

https://gitcode.com/openeuler/kernel/tree/OLK-6.6

如本项目内核 连接为 `7fb8860`，这个为kernel的git 短id，完整id为`7fb88605a2ec81f7d343ff776cb84740c9d55900`可前往此处查看git tree。

`https://gitcode.com/openeuler/kernel/commit/7fb88605a2ec81f7d343ff776cb84740c9d55900?ref=OLK-6.6`

#### zfs

属于zfs 的子模块链接

#### modules

这里是额外的第三方模块，

### 构建

在构建之前，需要下载子模块
```
git submodule update --init --depth=1
```

针对debian 内核，在debian上或者我们的docker镜像中，执行`bash autobuild.sh`即可

针对rpm内核，在openeuler上或者是我们的docker镜像，执行`bash build-rpm.sh`