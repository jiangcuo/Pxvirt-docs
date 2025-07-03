TODO: 
--------------
1. [ ] DPDKサポート
2. [x] SPDK
    - [ ] CephでのSPDKバックエンドサポート
    - [ ] SPDK RAID VGとLV管理
3. クラスター機能強化
    - [ ] クラスターヘルスチェックツール、IPMI、STOCli
    - [ ] クラスターVIP実装
    - 拡張機能
        - [ ] CephFSベースのNFSクラスター
        - [ ] Cephベースの分散型NVMeOFストレージ拡張
4. [ ] Debian 13ベースのRISC-V 64版

リリースノート:
--------------
3.7.2025: PXVIRT 8.4-3

 - SPDKサポートを追加

14.6.2025: PXVIRT 8.4 

  - ハイブリッドアーキテクチャクラスター向けのUIとバックエンド互換性

  - ZhaoxinとHygon CPUモデルのサポートを追加

  - すべてのアーキテクチャでカーネル6.6を使用。ARMサーバー向けのネットワークカードドライバーを追加

  - VM内でのNVMeディスクタイプのサポートを追加

  - eNFSサポートを有効化。参照: https://docs.openeuler.org/en/docs/20.03_LTS_SP4/docs/eNFS/enfs-user-guide.html

  - SPICE H.264エンコーディングをサポート

  - VM設定に`uuid`を割り当て

  - オフラインノードのVM資源表示を改善

  - RISC-V64、PPC64、S390xアーキテクチャ向けのTCGサポートを追加

  - VNCとSPICEでのNVIDIA vGPU RAMFBディスプレイ対応

  - pxvditemplateのための新API「qm disk clone」を導入

  - APIキーのパーミッション設定を強化

  - 一時的なVMスナップショットを実装。参照: https://wiki.qemu.org/Documentation/CreateSnapshot

  - SR-IOVデバイスパススルーを改善し、WebUI上でのVLANとMACアドレスの割り当てをサポート

  - より高速なCephクラスター作成のため、bcacheツールをPXVIRTに統合
