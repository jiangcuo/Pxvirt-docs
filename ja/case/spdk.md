## SPDK 紹介

SPDKはストレージアクセラレーションフレームワークです。QEMUアプリケーションにおいて、主にvhostを利用してストレージパスを短縮し、仮想マシンのディスク性能を向上させます。

我々はPXVIRTにSPDK機能を統合しました。AIO bdevタイプを採用し、従来のvirtio-scsi実装と比較して15%以上の性能向上と10%の遅延削減を実現しています。

主要コンポーネント：
1. PXVIRT-SPDK -> SPDKのメインプログラム。vhostプログラムと各種spdk_rpcおよびspdk_cliツールを含む
2. SPDK Perlモジュール -> 仮想マシンの起動時に、VM設定ファイルから`spdk[X]`のディスク情報を読み取り、新しいspdk bdevとvhostコントローラーを作成。仮想マシンのシャットダウン時に削除

## 既知の問題

1. SPDKディスクが存在する場合、仮想マシンはスナップショットやライブマイグレーションができません。
2. SPDKディスクはオンライン拡張ができません
3. 仮想マシンのシャットダウン時にspdk bdevが正しくクリーンアップされない場合、ディスクが削除できない可能性があります。
4. 大きなページメモリを予約する必要があります。そのため、メモリが少ないマシンではメモリの無駄遣いになります。これはアーキテクチャの要件であり、SPDKを使用するための前提条件です。

## バージョン要件

PXVIRTにおいて、QemuServerバージョンは > 8.3.12、pve-manager > 8.4.1 が必要です。これより高いバージョンにアップグレードすればspdk対応となります。

注意！loongarch64は現在サポートされていません！

## SPDK設定

SPDKのvhost設定ファイルは`/etc/spdk/vhost.conf`にあります
```
cores=0x1       # spdkプロセスにバインドするCPU
hugemem=2048    # spdkプロセスが使用するヒュージページサイズ
vhost=/var/tmp  # spdk vhostソケットの場所、これは変更できません
```

vhost.confを変更した後、pxvirt-spdkサービスを再起動する必要があります。注意！仮想マシンがpxvirt-spdkサービスを使用している場合、再起動すると仮想マシンにバインドされたspdkディスクでエラーが発生します。深刻な場合は仮想マシンがクラッシュする可能性があります！

そのため、再起動する場合は、仮想マシンがspdkディスクを使用していないことを確認してください。

## cores CPUマスク設定
`pxvirt-spdk`ソフトウェアパッケージに付属のcpumask_toolを使用して変換できます。

例えば、spdkプロセスを`13-16,50-56`のコアにバインドしたい場合。ここの記述はtasksetと同じです。

```bash
root@pvedevel:~#  cpumask_tool -c 13-16,50-56
Hex mask:   0x1fc00000001e000 # マスク
Core list:  13-16,50-56
Core count: 11
```

## ヒュージページ設定

`pxvirt-spdk`ソフトウェアパッケージをインストールすると、デフォルトでgrub設定ファイル`/etc/default/grub.d/spdk.cfg`が作成されます

このファイルがない場合（ISOからインストールした場合など）、このファイルを直接作成し、以下の内容を使用できます。

内容は以下のようになります：
```bash
cat /etc/default/grub.d/spdk.cfg
GRUB_CMDLINE_LINUX="hugepagesz=2M hugepages=2048 intel_iommu=on iommu=pt amd_iommu=on"
```

`hugepages=2048`の値を変更するだけです。最終的なヒュージページは`2M * 2048 = 4096M`のヒュージページです。8Gのヒュージページが必要な場合は`hugepages=4096`とします

注意！ヒュージページを有効にすると、この部分は完全に専有されるため、システムの利用可能メモリが減少します。メモリが十分でない場合は、2Gメモリのヒュージページを有効にすれば十分です。

変更後、`update-grub`で更新します。再起動後に有効になります

systemd-bootで起動している場合（ZFSをシステムディスクとして使用している場合など）、`hugepagesz=2M hugepages=2048 intel_iommu=on iommu=pt amd_iommu=on`を`/etc/kernel/cmdline`の同じ行の末尾に追加してください。

以下のように：
```bash
root@gpu2:~# cat /etc/kernel/cmdline 
root=ZFS=rpool/ROOT/pve-1 boot=zfs   intel_iommu=on hugepagesz=2M hugepages=2048 intel_iommu=on iommu=pt amd_iommu=on
```

最後に`proxmox-boot-tool refresh`を実行してブートローダーを更新します。

## PXVIRTでSPDKディスクを使用する

Webインターフェースでディスクを追加し、タイプとしてSPDKを選択するだけです。

初回使用の場合は、ホストにヒュージページが適用されていることを確認してください。ホストでヒュージページが有効になっていない場合は、再起動が必要です。

