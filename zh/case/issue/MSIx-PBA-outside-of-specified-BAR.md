# Hardware reports invalid configuration, MSIx PBA outside of specified BAR

在GPU多卡主机上，直通了PCI设备的虚拟机开机提示这个错误

## 表现

虚拟机开机提示这个错误

如下面案例！
`lspci -vvs 0000:2a:00.0`
```
0000:2a:00.0 3D controller: NVIDIA Corporation AD102GL [L20] (rev a1)
	Subsystem: NVIDIA Corporation AD102GL [L20]
	Control: I/O- Mem+ BusMaster- SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR- FastB2B- DisINTx-
	Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort- >SERR- <PERR- INTx-
	Interrupt: pin A routed to IRQ 52
	NUMA node: 0
	IOMMU group: 1
	Region 3: Memory at 800000000 (64-bit, prefetchable) [size=32M]  # 这里只出现了bar3，没有其他的bar
	Capabilities: [60] Power Management version 3
		Flags: PMEClk- DSI- D1- D2- AuxCurrent=0mA PME(D0+,D1-,D2-,D3hot+,D3cold-)
		Status: D3 NoSoftRst+ PME-Enable+ DSel=0 DScale=0 PME-
	Capabilities: [68] Null
	Capabilities: [78] Express (v2) Legacy Endpoint, MSI 00
		DevCap:	MaxPayload 256 bytes, PhantFunc 0, Latency L0s unlimited, L1 <64us
			ExtTag+ AttnBtn- AttnInd- PwrInd- RBE+ FLReset+
		DevCtl:	CorrErr- NonFatalErr- FatalErr- UnsupReq-
			RlxdOrd+ ExtTag+ PhantFunc- AuxPwr- NoSnoop+ FLReset-
			MaxPayload 128 bytes, MaxReadReq 512 bytes
		DevSta:	CorrErr- NonFatalErr- FatalErr- UnsupReq- AuxPwr- TransPend-
		LnkCap:	Port #0, Speed 16GT/s, Width x16, ASPM not supported
			ClockPM+ Surprise- LLActRep- BwNot- ASPMOptComp+
		LnkCtl:	ASPM Disabled; RCB 64 bytes, Disabled- CommClk-
			ExtSynch- ClockPM- AutWidDis- BWInt- AutBWInt-
		LnkSta:	Speed 16GT/s, Width x16
			TrErr- Train- SlotClk+ DLActive- BWMgmt- ABWMgmt-
		DevCap2: Completion Timeout: Range AB, TimeoutDis+ NROPrPrP- LTR+
			 10BitTagComp+ 10BitTagReq+ OBFF Via message, ExtFmt- EETLPPrefix-
			 EmergencyPowerReduction Not Supported, EmergencyPowerReductionInit-
			 FRS-
			 AtomicOpsCap: 32bit- 64bit- 128bitCAS-
		DevCtl2: Completion Timeout: 50us to 50ms, TimeoutDis- LTR- 10BitTagReq- OBFF Disabled,
			 AtomicOpsCtl: ReqEn-
		LnkCap2: Supported Link Speeds: 2.5-16GT/s, Crosslink- Retimer+ 2Retimers+ DRS-
		LnkCtl2: Target Link Speed: 16GT/s, EnterCompliance- SpeedDis-
			 Transmit Margin: Normal Operating Range, EnterModifiedCompliance- ComplianceSOS-
			 Compliance Preset/De-emphasis: -6dB de-emphasis, 0dB preshoot
		LnkSta2: Current De-emphasis Level: -6dB, EqualizationComplete+ EqualizationPhase1+
			 EqualizationPhase2+ EqualizationPhase3+ LinkEqualizationRequest-
			 Retimer- 2Retimers- CrosslinkRes: unsupported
	Capabilities: [b4] Vendor Specific Information: Len=14 <?>
	Capabilities: [c8] MSI-X: Enable- Count=6 Masked-
		Vector table: BAR=0 offset=00b90000
		PBA: BAR=0 offset=00ba0000
	Capabilities: [100 v1] Virtual Channel
		Caps:	LPEVC=0 RefClk=100ns PATEntryBits=1
		Arb:	Fixed- WRR32- WRR64- WRR128-
		Ctrl:	ArbSelect=Fixed
		Status:	InProgress-
		VC0:	Caps:	PATOffset=00 MaxTimeSlots=1 RejSnoopTrans-
			Arb:	Fixed- WRR32- WRR64- WRR128- TWRR128- WRR256-
			Ctrl:	Enable+ ID=0 ArbSelect=Fixed TC/VC=ff
			Status:	NegoPending- InProgress-
	Capabilities: [250 v1] Latency Tolerance Reporting
		Max snoop latency: 0ns
		Max no snoop latency: 0ns
	Capabilities: [258 v1] L1 PM Substates
		L1SubCap: PCI-PM_L1.2+ PCI-PM_L1.1+ ASPM_L1.2- ASPM_L1.1+ L1_PM_Substates+
			  PortCommonModeRestoreTime=255us PortTPowerOnTime=10us
		L1SubCtl1: PCI-PM_L1.2- PCI-PM_L1.1- ASPM_L1.2- ASPM_L1.1-
			   T_CommonMode=0us
		L1SubCtl2: T_PwrOn=10us
	Capabilities: [128 v1] Power Budgeting <?>
	Capabilities: [420 v2] Advanced Error Reporting
		UESta:	DLP- SDES- TLP- FCP- CmpltTO- CmpltAbrt- UnxCmplt- RxOF- MalfTLP- ECRC- UnsupReq- ACSViol-
		UEMsk:	DLP- SDES- TLP- FCP- CmpltTO- CmpltAbrt- UnxCmplt- RxOF- MalfTLP- ECRC- UnsupReq- ACSViol-
		UESvrt:	DLP+ SDES+ TLP- FCP+ CmpltTO- CmpltAbrt- UnxCmplt- RxOF+ MalfTLP+ ECRC- UnsupReq- ACSViol-
		CESta:	RxErr- BadTLP- BadDLLP- Rollover- Timeout- AdvNonFatalErr-
		CEMsk:	RxErr- BadTLP- BadDLLP- Rollover- Timeout- AdvNonFatalErr+
		AERCap:	First Error Pointer: 00, ECRCGenCap- ECRCGenEn- ECRCChkCap- ECRCChkEn-
			MultHdrRecCap- MultHdrRecEn- TLPPfxPres- HdrLogCap-
		HeaderLog: 00000000 00000000 00000000 00000000
	Capabilities: [600 v1] Vendor Specific Information: ID=0001 Rev=1 Len=024 <?>
	Capabilities: [900 v1] Secondary PCI Express
		LnkCtl3: LnkEquIntrruptEn- PerformEqu-
		LaneErrStat: 0
	Capabilities: [bb0 v1] Physical Resizable BAR
		BAR 0: current size: 16MB, supported: 16MB
		BAR 1: current size: 256MB, supported: 64MB 128MB 256MB 512MB 1GB 2GB 4GB 8GB 16GB 32GB 64GB
		BAR 3: current size: 32MB, supported: 32MB
	Capabilities: [bcc v1] Single Root I/O Virtualization (SR-IOV)
		IOVCap:	Migration- 10BitTagReq+ Interrupt Message Number: 000
		IOVCtl:	Enable- Migration- Interrupt- MSE- ARIHierarchy+ 10BitTagReq-
		IOVSta:	Migration-
		Initial VFs: 32, Total VFs: 32, Number of VFs: 0, Function Dependency Link: 00
		VF offset: 4, stride: 1, Device ID: 26ba
		Supported Page Size: 00000573, System Page Size: 00000001
		Region 0: Memory at 5a000000 (32-bit, non-prefetchable)
		Region 1: Memory at 0000000880000000 (64-bit, prefetchable)
		Region 3: Memory at 0000000802000000 (64-bit, prefetchable)
		VF Migration: offset: 00000000, BIR: 0
	Capabilities: [c14 v1] Alternative Routing-ID Interpretation (ARI)
		ARICap:	MFVC- ACS-, Next Function: 0
		ARICtl:	MFVC- ACS-, Function Group: 0
	Capabilities: [c1c v1] Physical Layer 16.0 GT/s <?>
	Capabilities: [d00 v1] Lane Margining at the Receiver <?>
	Capabilities: [e00 v1] Data Link Feature <?>
	Kernel driver in use: vfio-pci
	Kernel modules: nouveau
```

`dmesg|grep "BAR"`
```
    2.941829] pci 0000:2a:00.0: BAR 1: no space for [mem size 0x1000000000 64bit pref]
[    2.941830] pci 0000:2a:00.0: BAR 1: failed to assign [mem size 0x1000000000 64bit pref]
[    2.941832] pci 0000:2a:00.0: BAR 8: assigned [mem 0x800000000-0x17ffffffff 64bit pref]
[    2.941837] pci 0000:2a:00.0: BAR 3: assigned [mem 0x1800000000-0x1801ffffff 64bit pref]
[    2.941845] pci 0000:2a:00.0: BAR 10: assigned [mem 0x1802000000-0x1841ffffff 64bit pref]
[    2.941848] pci 0000:2a:00.0: BAR 0: no space for [mem size 0x01000000]
[    2.941850] pci 0000:2a:00.0: BAR 0: failed to assign [mem size 0x01000000]
[    2.941852] pci 0000:2a:00.0: BAR 7: assigned [mem 0x5a000000-0x5a7fffff]
[    2.941856] pci 0000:2a:00.0: BAR 1: no space for [mem size 0x1000000000 64bit pref]
[    2.941857] pci 0000:2a:00.0: BAR 1: failed to assign [mem size 0x1000000000 64bit pref]
[    2.941859] pci 0000:2a:00.0: BAR 3: assigned [mem 0x800000000-0x801ffffff 64bit pref]
[    2.941866] pci 0000:2a:00.0: BAR 0: no space for [mem size 0x01000000]
[    2.941867] pci 0000:2a:00.0: BAR 0: failed to assign [mem size 0x01000000]
[    2.941869] pci 0000:2a:00.0: BAR 7: assigned [mem 0x5a000000-0x5a7fffff]
[    2.941873] pci 0000:2a:00.0: BAR 10: assigned [mem 0x802000000-0x841ffffff 64bit pref]
[    2.941877] pci 0000:2a:00.0: BAR 8: assigned [mem 0x880000000-0x187fffffff 64bit pref]
[    2.941911] pci 0000:2b:00.0: BAR 14: assigned [mem 0x5b000000-0x5b1ffff3]
[    2.941912] pci 0000:2b:00.0: BAR 15: assigned [mem 0x1fc0000000-0x1fc01fff43 64bit pref]
[    2.941914] pci 0000:2b:00.0: BAR 13: assigned [io  0x1000-0x1f00]
[    2.941917] pci 0000:2c:00.0: BAR 14: assigned [mem 0x5b000000-0x5b1ffff3]
[    2.941918] pci 0000:2c:00.0: BAR 15: assigned [mem 0x1fc0000000-0x1fc01fff43 64bit pref]
[    2.941920] pci 0000:2c:00.0: BAR 13: assigned [io  0x1000-0x1f00]
[    2.941923] pci 0000:2d:00.0: BAR 0: assigned [mem 0x1fc0000000-0x1fc00fffff 64bit pref]
[    2.941931] pci 0000:2d:00.0: BAR 2: assigned [mem 0x5b000000-0x5b0fffff 64bit pref]
[    2.941940] pci 0000:2d:00.0: BAR 4: no space for [mem size 0x00100000]
[    2.941941] pci 0000:2d:00.0: BAR 4: failed to assign [mem size 0x00100000]
[    2.941943] pci 0000:2d:00.0: BAR 6: no space for [mem size 0x00100000 pref]
[    2.941945] pci 0000:2d:00.0: BAR 6: failed to assign [mem size 0x00100000 pref]
[    2.941947] pci 0000:2d:00.0: BAR 5: assigned [io  0x1000-0x10ff]
[    2.941951] pci 0000:2d:00.0: BAR 2: assigned [mem 0x5b000000-0x5b0fffff 64bit pref]
[    2.941959] pci 0000:2d:00.0: BAR 4: no space for [mem size 0x00100000]
[    2.941960] pci 0000:2d:00.0: BAR 4: failed to assign [mem size 0x00100000]
[    2.941962] pci 0000:2d:00.0: BAR 6: no space for [mem size 0x00100000 pref]
[    2.941964] pci 0000:2d:00.0: BAR 6: failed to assign [mem size 0x00100000 pref]
```

bar1 和 bar0 都失败了
```
[    2.941856] pci 0000:2a:00.0: BAR 1: no space for [mem size 0x1000000000 64bit pref]
[    2.941857] pci 0000:2a:00.0: BAR 1: failed to assign [mem size 0x1000000000 64bit pref]
[    2.941859] pci 0000:2a:00.0: BAR 3: assigned [mem 0x800000000-0x801ffffff 64bit pref]
[    2.941866] pci 0000:2a:00.0: BAR 0: no space for [mem size 0x01000000]
[    2.941867] pci 0000:2a:00.0: BAR 0: failed to assign [mem size 0x01000000]
```


## 解决方案

可以尝试以下方法：

1. 加内核参数 `pci=realloc` — 让内核重新分配 PCI 资源，可能解决窗口不足的问题
2. bios调整一下`MMIO High Base` + `MMIO High Size`
3. 更新一下bios