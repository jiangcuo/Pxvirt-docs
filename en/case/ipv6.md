# IPv6

## Bridge IPv6
This section covers IPv6 configuration for vmbrX bridges, based on the ifupdown2 backend (default).

### Static IPv6
```
iface vmbr0 inet6 static
      address  2001:ded:beef:2::1/64
```
Configuration explanation:
- `inet6 static`: Specifies the use of a static IPv6 address
- `address`: Specifies the IPv6 address and prefix length (/64 is the standard subnet mask)

### SLAAC Auto-configuration
```
iface vmbr0 inet6 auto
      autoconf 1
      accept_ra 2
      bridge-mcsnoop no
```
Configuration explanation:
- `inet6 auto`: Enables IPv6 auto-configuration
- `autoconf 1`: Enables SLAAC (Stateless Address Auto-Configuration)
- `accept_ra 2`: Accept Router Advertisements (RA)
  - `0` = Do not accept router advertisements
  - `1` = Accept only in non-forwarding mode
  - `2` = **Accept even in forwarding mode** (bridges typically operate in forwarding mode, so this must be set to 2)
- `bridge-mcsnoop no`: Disables multicast snooping on the bridge
  - This is critical for IPv6, as the Neighbor Discovery Protocol (NDP) relies on multicast
  - If not disabled, IPv6 multicast traffic may be incorrectly filtered, causing connectivity issues

### Important Notes
1. Bridges, as forwarding devices, must use `accept_ra 2` to correctly receive router advertisements
2. Disabling `bridge-mcsnoop` is essential for proper IPv6 operation, especially for the NDP protocol
3. Network service restart or system reboot is required for configuration changes to take effect
