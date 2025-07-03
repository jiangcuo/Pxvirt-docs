TODO: 
--------------
1. [ ] Support DPDK
2. [x] SPDK
    - [ ] Ceph with SPDK backend support
    - [ ] SPDK RAID VG and LV management
3. Cluster Enhancement
    - [ ] Cluster health check tools, IPMI, STOCli
    - [ ] Cluster VIP implementation
    - Extended Features
        - [ ] NFS cluster based on CephFS
        - [ ] NVMeOF distributed storage extension based on Ceph
4. [ ] RISC-V 64 version based on Debian 13

Release Notes:
--------------
3.7.2025: PXVIRT 8.4-3

 - Add SPDK support

14.6.2025: PXVIRT 8.4 

  - UI and Backend Compatibility for Hybrid Architecture Clusters

  - Add support for Zhaoxin and Hygon CPU models.

  - Use kernel 6.6 for all architectures. Add more network card drivers for ARM servers.

  - Add support for NVMe disk types in VMs.

  - Enable eNFS support. Refer to: https://docs.openeuler.org/en/docs/20.03_LTS_SP4/docs/eNFS/enfs-user-guide.html

  - Support spice h.264 encoding.

  - Assign `uuid` to VMs config.

  - Improve vm resource display for offline nodes.

  - Add TCG support for riscv64, ppc64, and s390x architectures.

  - Nvidia vGPU ramfb display in the vnc and spice.

  - Introduce a new API "qm disk clone" for pxvditemplate.

  - Enhance API key permission configurations.

  - Implement temporary VM snapshots. Refer to: https://wiki.qemu.org/Documentation/CreateSnapshot

  - Improve SR-IOV device passthrough, supporting assign VLAN and MAC addresses on webui.

  - Integrate bcache tools into pxvirt to deploy faster Ceph cluster creation.


13.12.2024: Proxmox Virtual Environment 8.3 for Port

 - All packages are built automatically. https://ci.lierfang.com
 
 - Add ceph Squid for loongarch64.

 - Kernel 6.12 with ZFS 2.2.7 for LoongArch.

 - Kernel 5.10-openeuler & 6.1-LTS with ZFS 2.2.7 for Arm64.

 - New Qemu 9.2 

 - LoongArch lbt passthrough support.

 - Fix pcie addr map on Port.

 - Add LoongArch nvram support.
 
 - Add automated installation support for Port.