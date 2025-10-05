# ipv6

## 网桥  ipv6
这里主要指出了 在vmbrX 网桥的ipv6配置，基于ifupdown2后端（默认）

### 静态ipv6
```
iface vmbr0 inet6 static
      address  2001:ded:beef:2::1/64
```
配置说明：
- `inet6 static`：指定使用静态IPv6地址
- `address`：指定IPv6地址和前缀长度（/64是标准的子网掩码）

### SLAAC 自动配置
```
iface vmbr0 inet6 auto
      autoconf 1
      accept_ra 2
      bridge-mcsnoop no
```
配置说明：
- `inet6 auto`：启用IPv6自动配置
- `autoconf 1`：启用SLAAC（无状态地址自动配置）
- `accept_ra 2`：接受路由器通告（Router Advertisement）
  - `0` = 不接受路由器通告
  - `1` = 仅在非转发模式下接受
  - `2` = **即使在转发模式下也接受**（网桥通常工作在转发模式，因此需要设置为2）
- `bridge-mcsnoop no`：禁用网桥的多播窥探功能
  - 这对于IPv6非常重要，因为IPv6的邻居发现协议（NDP）依赖多播
  - 如果不禁用，可能导致IPv6多播流量被错误过滤，造成连接问题

### 注意事项
1. 网桥作为转发设备，必须使用 `accept_ra 2` 才能正确接收路由器通告
2. 禁用 `bridge-mcsnoop` 是确保IPv6正常工作的关键，特别是对于NDP协议
3. 配置修改后需要重启网络服务或重启系统才能生效