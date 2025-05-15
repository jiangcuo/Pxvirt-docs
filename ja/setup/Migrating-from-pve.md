# Proxmox VEからの移行

Proxmox VEをPxvirtに移行するには、次のコマンドを実行します。

関連ディスカッション: [discussions/181](https://github.com/jiangcuo/pxvirt/discussions/181)

```bash
curl -Lf -o /tmp/temp.sh https://raw.githubusercontent.com/jiangcuo/Pxvirt-docs/refs/heads/main/pxvirt-tools.sh
chmod +x /tmp/temp.sh
/tmp/temp.sh pxvirt
```


## Proxmox VEに戻す

PxvirtをProxmox VEに戻すには、次のコマンドを実行します。

現時点では、x86_64 アーキテクチャ用の Proxmox VE 復元のみがサポートされていることに注意してください。他のアーキテクチャ用の Proxmox VE 復元は手動でインストールする必要があります。

このスクリプトはまだテスト段階であり、問題がある可能性があります。注意してご使用ください。何か問題が発生した場合は、ご連絡ください。

```bash
/tmp/temp.sh pve
```
