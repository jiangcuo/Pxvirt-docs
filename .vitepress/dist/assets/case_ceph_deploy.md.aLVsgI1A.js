import{_ as a,c as n,o as p,ah as e}from"./chunks/framework.HzbgFGQH.js";const i="/assets/ceph3.BJ3c5Ec9.png",l="/assets/ceph5.CP7RBQyn.png",t="/assets/ceph1.BpFekMwC.png",c="/assets/ceph4.DxZOtZ9o.png",d="/assets/ceph2.C8JDS5Qi.png",h="/assets/ceph6.CXBsSP1f.png",r="/assets/ceph7.BaLjxcdQ.png",o="/assets/ceph8.DdR8cQdp.png",b="/assets/ceph9.BK5Hhq1q.png",g="/assets/ceph10.CBnE9wzS.png",k="/assets/ceph11.B84_z9ty.png",u="/assets/ceph12.C6LNcKVT.png",T=JSON.parse('{"title":"ceph 部署","description":"","frontmatter":{},"headers":[],"relativePath":"case/ceph/deploy.md","filePath":"case/ceph/deploy.md"}'),m={name:"case/ceph/deploy.md"};function f(v,s,y,C,x,S){return p(),n("div",null,s[0]||(s[0]=[e('<h1 id="ceph-部署" tabindex="-1">ceph 部署 <a class="header-anchor" href="#ceph-部署" aria-label="Permalink to “ceph 部署”">​</a></h1><p>关于Ceph的介绍，在本内容中，我们不在赘述。</p><p>本项目使用5台机器，组成一个超融合环境，里面运行一些服务，使用SDN进行网络管理。</p><h2 id="一、硬件配置" tabindex="-1">一、硬件配置 <a class="header-anchor" href="#一、硬件配置" aria-label="Permalink to “一、硬件配置”">​</a></h2><p>因为成本的关系，硬件采用老型号机器。</p><table tabindex="0"><thead><tr><th>类型</th><th>型号</th><th>数量</th></tr></thead><tbody><tr><td>服务器</td><td>超聚变 2288H v5</td><td>1</td></tr><tr><td>CPU</td><td>英特尔® 至强® 金牌 6148 处理器27.5M 高速缓存，2.40 GHz</td><td>2</td></tr><tr><td>内存</td><td>三星 32G 2Rx4 PC4 -2933Y</td><td>8</td></tr><tr><td>硬盘</td><td>东芝HDWT740 S300系列5400转128m 3.5 SATA3</td><td>8</td></tr><tr><td>网卡</td><td>华为SP333 双口25G SFP28 PCI-E 8X</td><td>2</td></tr><tr><td>电源</td><td>华为PAC9000S12-BE 900W电源</td><td>2</td></tr><tr><td>阵列卡</td><td>华为SR430C BC61ESMLB</td><td>1</td></tr><tr><td>系统盘</td><td>INTEL S3510 120G MLC 200TBW SATA3 SSD</td><td>2</td></tr><tr><td>缓存盘</td><td>三星1725B PCIE3.0 X8 1.6t AIC PCIE 8X</td><td>1</td></tr><tr><td>交换机1</td><td>H3c S6520-24S-SI</td><td>1</td></tr><tr><td>交换机2</td><td>H3c S1850v2-28P-HPWR-EI</td><td>1</td></tr></tbody></table><h2 id="二、ceph设计" tabindex="-1">二、Ceph设计 <a class="header-anchor" href="#二、ceph设计" aria-label="Permalink to “二、Ceph设计”">​</a></h2><p>我们使用HDD来节省成本，使用U.2作为缓存盘</p><img src="'+i+'" width="600"><p>缓存盘对于全HDD的ceph场景性能提升巨大。原理如下图所示</p><img src="'+l+'" width="600"><p>上图使用一块7.68T的 nvme 分割成3部分，4T分区作为bcache。</p><p>其他的分别做ceph osd的DB和wal存储。</p><p>因为PVE使用LVM管理 DB wal，所以我们不需要单独去划分对应的分区，直接指定一个分区，pve会自动在这个分区内创建LVM存储ceph db。</p><h3 id="ssd缓存的选择" tabindex="-1">SSD缓存的选择 <a class="header-anchor" href="#ssd缓存的选择" aria-label="Permalink to “SSD缓存的选择”">​</a></h3><h4 id="ssd的选型" tabindex="-1">SSD的选型 <a class="header-anchor" href="#ssd的选型" aria-label="Permalink to “SSD的选型”">​</a></h4><p>通常来说SSD的性能存在瓶颈，如果要使用ssd做为缓存，那么最好使用sas ssd。</p><p>如果是NVME，推荐使用企业级的NVME，如果是M.2这种，请勿尝试。 使用PCIE4.0的 U.2无疑是一个非常好的选择，如CD6。</p><p>因为成本关系，我们还是使用1.6t的1725b aic版本。所谓aic版本就是他像显卡一样，是一个pcie设备，可以插到PCI槽当中。</p><h4 id="ssd的大小" tabindex="-1">SSD的大小 <a class="header-anchor" href="#ssd的大小" aria-label="Permalink to “SSD的大小”">​</a></h4><p>按照BlueStore部署的建议，db存储元数据，最好大于等于主存储容量的4%。如果是4T，那么db大小就是160G。</p><p>但我们存放虚拟机数据，用的是RBD，db的大小为物理盘的1-2%都可以，如果是4t，db要求80G，我们有8块4T,那么DB就应该是640G。如果是按照官方建议，我们的NVME的db盘 就至少要3.2t了。</p><p>wal的大小通常没什么要求。有个20-30G就足够了。</p><p>我们希望bcache缓存能完全接管顺序和随机io，因此bcache的缓存大小应该足够大。单盘5%~10%最佳。例如4t的磁盘，缓存大小应在200G~400g之间，8盘就要在1.6t以上了。</p><h4 id="ssd的数量。" tabindex="-1">SSD的数量。 <a class="header-anchor" href="#ssd的数量。" aria-label="Permalink to “SSD的数量。”">​</a></h4><p>如果是单盘缓存，存在硬盘故障的风险，所以不建议使用消费级的SSD和消费级的NVME。</p><p>正常情况下，是需要防止缓存盘故障的，建议是多块盘做缓存。</p><p>例如有8块4T，我们有2块SSD，那么ssd0做 hdd0-hdd3的缓存，ssd1 做hdd4-hdd7的缓存。</p><p>最保险的方式，可以使用2块SAS或者sata盘使用硬件raid1，来做缓存。这样缓存盘就不容易坏。但是需要高性能的raid卡。</p><p>但如果你的ceph集群数量足够，且规范部署，一块企业缓存盘也行。假设缓存盘故障，代表这个节点故障，实际上不影响整个集群的健康的，ceph会自动修复。但推荐使用2块更加的安全。</p><h3 id="选择-1725b的原因" tabindex="-1">选择 1725b的原因 <a class="header-anchor" href="#选择-1725b的原因" aria-label="Permalink to “选择 1725b的原因”">​</a></h3><p>本项目的场景热数据较少，只是跑一些常驻的服务，也没有桌面需求，我们还是使用1.6t的1725b aic版本。</p><p>拿500G做读写缓存，拿700G做osd的DB，拿200G做wal存储。这样的分配比较合理，</p><h2 id="三、网络架构" tabindex="-1">三、网络架构 <a class="header-anchor" href="#三、网络架构" aria-label="Permalink to “三、网络架构”">​</a></h2><p><img src="'+t+'" alt="alt text" loading="lazy"></p><div class="info custom-block"><p class="custom-block-title custom-block-title-default">INFO</p><p>在最佳实践中，ceph交换机应该做主备，在本case中，因为项目条件限制，所以单台。</p><p>例如两台S6520 互相堆叠，双网口互相连两交换机做堆叠。</p></div><p>我们利用PVE SDN的功能，可以将交换机设置为Trunk模式，这样虚拟机的流量或者集群通信的链路，就可以自由的在PVE中设置。而不用去设置交换机，但是如果要精细的控制交换机流量，就必须去配置交换机。</p><p>可以看下面的逻辑，vmbrX 和交换机 只是充当一个纯流量交换设备。 网桥上的流量管理由通过SDN来控制。</p><img src="'+c+`" width="600"><h3 id="交换机配置" tabindex="-1">交换机配置 <a class="header-anchor" href="#交换机配置" aria-label="Permalink to “交换机配置”">​</a></h3><p>下面是H3C 的操作示例</p><details class="details custom-block"><summary>展开查看过程</summary><p>先创建ladp组</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>interface Bridge-Aggregation 10</span></span></code></pre></div><p>将2个网卡加入到聚合组当中</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>interface  range xge1/0/21 to xge1/0/22</span></span>
<span class="line"><span>port link-aggregation group 10 force</span></span></code></pre></div><p>设置为动态聚合</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>link-aggregation mode dynamic                                         </span></span>
<span class="line"><span>link-aggregation selected-port minimum 1                              </span></span>
<span class="line"><span>link-aggregation selected-port maximum 2</span></span></code></pre></div><p>设置 trunk</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>port link-type trunk                                                  </span></span>
<span class="line"><span>port trunk permit vlan all</span></span></code></pre></div></details><h3 id="pve-bond" tabindex="-1">PVE bond <a class="header-anchor" href="#pve-bond" aria-label="Permalink to “PVE bond”">​</a></h3><p>服务器自带2口10G SFP+网口，因此可以和PCIE的SP333 互组linux bond。</p><img src="`+d+`" width="200"><p>这2个bond仅做集群流量使用 下面是PVE的网络配置示例</p><details class="details custom-block"><summary>展开查看 PVE 网络示例</summary><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>auto lo</span></span>
<span class="line"><span>iface lo inet loopback</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iface ens18 inet manual</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto eno1</span></span>
<span class="line"><span>iface eno1 inet manual</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto eno2</span></span>
<span class="line"><span>iface eno2 inet manual</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iface eno3 inet manual</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iface eno4 inet manual</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto ens3f0</span></span>
<span class="line"><span>iface ens3f0 inet manual</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto ens3f1</span></span>
<span class="line"><span>iface ens3f1 inet manual</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto bond1</span></span>
<span class="line"><span>iface bond1 inet manual</span></span>
<span class="line"><span>        bond-slaves eno2 ens3f0</span></span>
<span class="line"><span>        bond-miimon 100</span></span>
<span class="line"><span>        bond-mode 802.3ad</span></span>
<span class="line"><span>        bond-xmit-hash-policy layer2+3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto bond0</span></span>
<span class="line"><span>iface bond0 inet manual</span></span>
<span class="line"><span>        bond-slaves eno1 ens3f1</span></span>
<span class="line"><span>        bond-miimon 100</span></span>
<span class="line"><span>        bond-mode 802.3ad</span></span>
<span class="line"><span>        bond-xmit-hash-policy layer2+3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto bond1.188</span></span>
<span class="line"><span>iface bond1.188 inet static</span></span>
<span class="line"><span>        address 192.168.188.11/24</span></span>
<span class="line"><span># bond1 vlan 188  ceph 公共网络</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto bond0.88</span></span>
<span class="line"><span>iface bond0.88 inet static</span></span>
<span class="line"><span>        address 192.168.88.11/24</span></span>
<span class="line"><span># bond0 vlan 88 ceph cluster网络，处理osd内部流量</span></span></code></pre></div></details><h2 id="四、安装ceph" tabindex="-1">四、安装ceph <a class="header-anchor" href="#四、安装ceph" aria-label="Permalink to “四、安装ceph”">​</a></h2><p>使用pve-iso-builder项目，可以构建自带ceph的iso镜像，不用再次安装ceph。如果原来的系统，没有ceph，请参考下面方式进行安装</p><div class="danger custom-block"><p class="custom-block-title custom-block-title-default">DANGER</p><p>请勿从网页上安装ceph</p></div><p>从网页上安装会破坏ceph软件源。</p><details class="details custom-block"><summary>展开查看过程</summary><p>我们推荐安装最新的版本，如ceph-squid版本。</p><p>添加软件源</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>echo &quot;deb https://download.lierfang.com/pxcloud/pxvirt bookworm ceph-squid&quot; &gt; /etc/apt/sources.list.d/pxvirt-ceph.list</span></span></code></pre></div><p>在节点上安装ceph</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>apt update</span></span>
<span class="line"><span>apt install ceph -y</span></span></code></pre></div><p>如果节点数量很多，也可以使用<code>pvessh</code>命令批量操作</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>pvessh echo &quot;deb https://download.lierfang.com/pxcloud/pxvirt bookworm ceph-squid&quot; &gt; /etc/apt/sources.list.d/pxvirt-ceph.list</span></span>
<span class="line"><span>pvessh apt update</span></span>
<span class="line"><span>pvessh apt install ceph -y</span></span></code></pre></div></details><h2 id="五、-配置ceph" tabindex="-1">五、 配置ceph <a class="header-anchor" href="#五、-配置ceph" aria-label="Permalink to “五、 配置ceph”">​</a></h2><p>这时候 就可以在网页上设置ceph了。</p><p>注意把集群网络和公共网络分开。</p><h2 id="六、配置bcache缓存" tabindex="-1">六、配置Bcache缓存 <a class="header-anchor" href="#六、配置bcache缓存" aria-label="Permalink to “六、配置Bcache缓存”">​</a></h2><p>这里我们拿500G做bcache，拿600G做osd的DB （每个硬盘75G的db），拿200G做wal存储(每个硬盘25G)。</p><p>我们使用sgdisk工具进行分区。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span># 清除磁盘数据</span></span>
<span class="line"><span>dd if=/dev/zero of=/dev/nvme0n1 bs=1M count=16</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 创建GPT分区表</span></span>
<span class="line"><span>sgdisk -ZG /dev/nvme0n1</span></span>
<span class="line"><span># 创建bcache分区</span></span>
<span class="line"><span>sgdisk -a1 -n1:1M:+500G  /dev/nvme0n1  </span></span>
<span class="line"><span># 创建db分区</span></span>
<span class="line"><span>sgdisk -a1 -n2:501G:+600G  /dev/nvme0n1  </span></span>
<span class="line"><span># 创建wal分区</span></span>
<span class="line"><span>sgdisk -a1 -n3:1102G:+200G  /dev/nvme0n1</span></span></code></pre></div><p>使用pvebcache创建bcache</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>pvebcache  cache create /dev/nvme0n1p1</span></span></code></pre></div><p>使用pvebcache创建后端的磁盘</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>root@node1:~# lsblk</span></span>
<span class="line"><span>NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS</span></span>
<span class="line"><span>sda           8:0    0   3.6T  0 disk </span></span>
<span class="line"><span>sdb           8:16   0   3.6T  0 disk </span></span>
<span class="line"><span>sdc           8:32   0   3.6T  0 disk </span></span>
<span class="line"><span>sdd           8:48   0   3.6T  0 disk </span></span>
<span class="line"><span>sde           8:64   0   3.6T  0 disk </span></span>
<span class="line"><span>sdf           8:80   0   3.6T  0 disk </span></span>
<span class="line"><span>sdg           8:96   0   3.6T  0 disk </span></span>
<span class="line"><span>sdh           8:112  0   3.6T  0 disk </span></span>
<span class="line"><span>sdi           8:128  0 447.1G  0 disk </span></span>
<span class="line"><span>├─sdi1        8:129  0  1007K  0 part </span></span>
<span class="line"><span>├─sdi2        8:130  0     1G  0 part </span></span>
<span class="line"><span>└─sdi3        8:131  0 446.1G  0 part </span></span>
<span class="line"><span>sdj           8:144  0 447.1G  0 disk </span></span>
<span class="line"><span>├─sdj1        8:145  0  1007K  0 part </span></span>
<span class="line"><span>├─sdj2        8:146  0     1G  0 part </span></span>
<span class="line"><span>└─sdj3        8:147  0 446.1G  0 part </span></span>
<span class="line"><span>nvme0n1     259:1    0   1.5T  0 disk </span></span>
<span class="line"><span>├─nvme0n1p1 259:2    0   500G  0 part </span></span>
<span class="line"><span>├─nvme0n1p2 259:3    0   600G  0 part </span></span>
<span class="line"><span>└─nvme0n1p3 259:4    0   200G  0 part</span></span></code></pre></div><p>我们可以看到磁盘3.6T的就是我们需要的后端OSD盘，我们需要将其变成bcache的后端设备。</p><p>因为是连号，所以我们可以通过循环脚本直接全部处理</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>for id in {a..h} ;do </span></span>
<span class="line"><span>pvebcache create /dev/sd$id</span></span>
<span class="line"><span>done</span></span></code></pre></div><p>现在我们可以看到磁盘上有bache了。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>root@node1:~# lsblk</span></span>
<span class="line"><span>NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS</span></span>
<span class="line"><span>sda           8:0    0   3.6T  0 disk </span></span>
<span class="line"><span>└─bcache0   251:0    0   3.6T  0 disk </span></span>
<span class="line"><span>sdb           8:16   0   3.6T  0 disk </span></span>
<span class="line"><span>└─bcache1   251:128  0   3.6T  0 disk </span></span>
<span class="line"><span>sdc           8:32   0   3.6T  0 disk </span></span>
<span class="line"><span>└─bcache2   251:256  0   3.6T  0 disk </span></span>
<span class="line"><span>sdd           8:48   0   3.6T  0 disk </span></span>
<span class="line"><span>└─bcache3   251:384  0   3.6T  0 disk </span></span>
<span class="line"><span>sde           8:64   0   3.6T  0 disk </span></span>
<span class="line"><span>└─bcache4   251:512  0   3.6T  0 disk </span></span>
<span class="line"><span>sdf           8:80   0   3.6T  0 disk </span></span>
<span class="line"><span>└─bcache5   251:640  0   3.6T  0 disk </span></span>
<span class="line"><span>sdg           8:96   0   3.6T  0 disk </span></span>
<span class="line"><span>└─bcache6   251:768  0   3.6T  0 disk </span></span>
<span class="line"><span>sdh           8:112  0   3.6T  0 disk </span></span>
<span class="line"><span>└─bcache7   251:896  0   3.6T  0 disk </span></span>
<span class="line"><span>sdi           8:128  0 447.1G  0 disk </span></span>
<span class="line"><span>├─sdi1        8:129  0  1007K  0 part </span></span>
<span class="line"><span>├─sdi2        8:130  0     1G  0 part </span></span>
<span class="line"><span>└─sdi3        8:131  0 446.1G  0 part </span></span>
<span class="line"><span>sdj           8:144  0 447.1G  0 disk </span></span>
<span class="line"><span>├─sdj1        8:145  0  1007K  0 part </span></span>
<span class="line"><span>├─sdj2        8:146  0     1G  0 part </span></span>
<span class="line"><span>└─sdj3        8:147  0 446.1G  0 part </span></span>
<span class="line"><span>nvme0n1     259:1    0   1.5T  0 disk </span></span>
<span class="line"><span>├─nvme0n1p1 259:2    0   500G  0 part </span></span>
<span class="line"><span>├─nvme0n1p2 259:3    0   600G  0 part </span></span>
<span class="line"><span>└─nvme0n1p3 259:4    0   200G  0 part</span></span></code></pre></div><p>现在我们再将给后端的磁盘加上缓存</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>for id in \`seq 0 7\` ;do </span></span>
<span class="line"><span>pvebcache cache attach /dev/bcache$id --cache nvme0n1p1</span></span>
<span class="line"><span>done</span></span></code></pre></div><p>这时候就可以看到缓存信息了</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>root@node1:~# pvebcache list</span></span>
<span class="line"><span>name       type       backend-dev          cache-dev             state           size            cachemode      </span></span>
<span class="line"><span>bcache0    backend    sdc                  nvme0n1p1            Running         3727GB          writeback       </span></span>
<span class="line"><span>bcache1    backend    sda                  nvme0n1p1            Running         3727GB          writeback       </span></span>
<span class="line"><span>bcache2    backend    sde                  nvme0n1p1            Running         3727GB          writeback       </span></span>
<span class="line"><span>bcache3    backend    sdd                  nvme0n1p1            Running         3727GB          writeback       </span></span>
<span class="line"><span>bcache4    backend    sdg                  nvme0n1p1            Running         3727GB          writeback       </span></span>
<span class="line"><span>bcache5    backend    sdb                  nvme0n1p1            Running         3727GB          writeback       </span></span>
<span class="line"><span>nvme0n1p1  cache      none                 none                 Running         500GB           none</span></span></code></pre></div><p>设置缓存比例和顺序缓存</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>root@node1:~# </span></span>
<span class="line"><span>for i in \`seq 0 7\`;do </span></span>
<span class="line"><span>pvebcache  cache  set  bcache$i --wb-percent 40 --sequential 16384 --cachemode writeback </span></span>
<span class="line"><span>done</span></span>
<span class="line"><span>cache_mode: writethrough [writeback] writearound none =&gt; writethrough [writeback] writearound none </span></span>
<span class="line"><span>writeback_percent: 10 =&gt; 40 </span></span>
<span class="line"><span>sequential_cutoff: 4.0M =&gt; 16.0M</span></span></code></pre></div><p>上面命令将缓存比例为40%，缓存16M一下的顺序io</p><h2 id="七、添加ceph-osd" tabindex="-1">七、添加Ceph OSD <a class="header-anchor" href="#七、添加ceph-osd" aria-label="Permalink to “七、添加Ceph OSD”">​</a></h2><p>我们可以在网页上，添加OSD</p><p><img src="`+h+'" alt="alt text" loading="lazy"></p><p>磁盘选择bcache，DB disk选择我们的磁盘分区，注意这里的DB SIZE需要指定。我们是600G空间做db，8个硬盘，差不多每个硬盘75G，这里我们设置为73。</p><p>Wal Disk 选择WAL分区，size 我们指定为23G</p><p><img src="'+r+'" alt="alt text" loading="lazy"></p><p>耐心等待即可创建成功。</p><p>我们也可以通过命令行快速创建</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>for disk in `seq 1 7`;do</span></span>\n<span class="line"><span>pveceph osd create /dev/bcache$disk --db_dev /dev/nvme0n1p2 --db_dev_size 73 --wal_dev /dev/nvme0n1p3 --wal_dev_size 23</span></span>\n<span class="line"><span>done</span></span></code></pre></div><p>这样一个节点的ceph就创建好了 <img src="'+o+'" alt="alt text" loading="lazy"></p><p>现在我们将上面的步骤，在其他的节点上执行</p><h2 id="八、添加ceph-管理和监视器节点" tabindex="-1">八、添加ceph 管理和监视器节点 <a class="header-anchor" href="#八、添加ceph-管理和监视器节点" aria-label="Permalink to “八、添加ceph 管理和监视器节点”">​</a></h2><p>在PVE的网页上，添加至少半数以上的节点，以保证服务的稳定运行。</p><p><img src="'+b+'" alt="alt text" loading="lazy"></p><h2 id="九、创建ceph-池用于存放虚拟机磁盘" tabindex="-1">九、创建Ceph 池用于存放虚拟机磁盘 <a class="header-anchor" href="#九、创建ceph-池用于存放虚拟机磁盘" aria-label="Permalink to “九、创建Ceph 池用于存放虚拟机磁盘”">​</a></h2><p><img src="'+g+'" alt="alt text" loading="lazy"></p><p>只要取个名字，就可以了。默认是3副本策略，最小副本数是2，即在有节点或者osd掉线时，如果副本数低于2，则集群会被冻结。</p><h2 id="十、创建cephfs文件池" tabindex="-1">十、创建cephfs文件池 <a class="header-anchor" href="#十、创建cephfs文件池" aria-label="Permalink to “十、创建cephfs文件池”">​</a></h2><p>cephfs 是文件类型存储，可以存放iso镜像</p><p><img src="'+k+'" alt="alt text" loading="lazy"></p><p>直接创建半数以上的mds服务器，随后创建一个cephfs类型的池即可。</p><p><img src="'+u+`" alt="alt text" loading="lazy"></p><h2 id="十一、配置ntp服务器" tabindex="-1">十一、配置NTP服务器 <a class="header-anchor" href="#十一、配置ntp服务器" aria-label="Permalink to “十一、配置NTP服务器”">​</a></h2><p>创建一个虚拟机，安装好chroy，并配置ntp服务</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>apt update &amp;&amp; apt install chrony -y</span></span>
<span class="line"><span>echo &quot;server ntp.aliyun.com iburst&quot; &gt;&gt; /etc/chrony/conf.d/ntpserver.conf  # 使用阿里云作为上游ntp时间服务器</span></span>
<span class="line"><span>echo &quot;allow 192.168.100.0/24&quot; &gt;&gt; /etc/chrony/conf.d/ntpserver.conf # 允许某个网段访问</span></span>
<span class="line"><span>echo &quot;local stratum 10&quot; &gt;&gt; /etc/chrony/conf.d/ntpserver.conf # 允许本地授时</span></span>
<span class="line"><span>systemctl restart chrony</span></span></code></pre></div><p>ntp服务器配置好了，将ntp服务器的地址写入集群</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>pvessh echo &#39;server 192.168.122.253 iburst&#39; &gt; /etc/chrony/sources.d/local-ntp-server.sources</span></span>
<span class="line"><span>pvessh systemctl restart chrony</span></span></code></pre></div><p>之后我们可以验证</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>pvessh chronyc sources -v</span></span></code></pre></div><p>配置好后，我们可以把这个虚拟机克隆一份，再修改这个虚拟机的ip，这样集群就有2个NTP时间服务器，稳定性更高。</p>`,105)]))}const _=a(m,[["render",f]]);export{T as __pageData,_ as default};
