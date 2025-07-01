import { defineConfig } from 'vitepress'

// 中文导航栏
const zhNav = [
  { text: '首页', link: '/zh/' },
  { text: '梨儿方', link: 'https://www.lierfang.com' },
  { text: 'PXVDI文档', link: 'https://docs.pxvdi.lierfang.com' },
]

// 英文导航栏
const enNav = [
  { text: 'Home', link: '/en/' },
  { text: 'Lierfang', link: 'https://www.lierfang.com' },
  { text: 'PXVDI Docs', link: 'https://docs.pxvdi.lierfang.com' },
]

// 日文导航栏
const jaNav = [
  { text: 'ホーム', link: '/ja/' },
  { text: 'リアファン', link: 'https://www.lierfang.com' },
  { text: 'PXVDI ドキュメント', link: 'https://docs.pxvdi.lierfang.com' },
]

// 中文侧边栏
const zhSidebar = [
  {
    text: '介绍',
    link: '/zh/README'
  },
  {
    text: '一 基本使用',
    items: [
      { text: '介绍', link: '/zh/README'},
      { text: '安装帮助', link: '/zh/install' },
      { text: '初次使用',
        items: [
          { text: '在x86上安装windows', link: '/zh/setup/Windows-on-x86' },
          { text: '在arm64/龙芯上安装Linux', link: '/zh/setup/Linux-on-port' },
          { text: '从 Proxmox VE 迁移', link: '/zh/setup/Migrating-from-pve' },
        ]
      },
      { text: '资源下载', link: '/zh/resources' },
      { text: '软件仓库', link: '/zh/repo' }
    ]
  },
  {
    text: '二 功能详情',
    items: [
      { text: 'UI', link: '/zh/ui'},
      { text: 'CLI', link: '/zh/cli',
        items: [
          { text: 'qm', link: '/zh/cli/qm' },
          { text: 'pvessh', link: '/zh/cli/pvessh' },
          { text: 'pvebcache', link: '/zh/cli/pvebcache' },
          { text: 'proxmox-boot-tool', link: '/zh/cli/proxmox-boot-tool' },
        ]
      },
      { text: 'API', link: '/zh/api' }
    ]
  },{
    text: '三 案例',
    items: [
      { text: 'Ceph',link: '/zh/case/ceph',
        items: [
          {text: '1. 部署', link: '/zh/case/ceph/deploy'},
          {text: '2. 运维', link: '/zh/case/ceph/maintenance'},
        ]
      },
      { text: 'vGPU',
        items: [
          {text: '1. Nvidia vGPU', link: '/zh/case/vgpu/nvgpu'},
          {text: '2. 摩尔线程 vGPU', link: '/zh/case/vgpu/mthreads'},
        ]
      },
      { text: 'eNFS', link: '/zh/case/enfs'},
      { text: 'SPDK', link: '/zh/case/spdk'},
    ]
  }
]

// 英文侧边栏
const enSidebar = [
  {
    text: 'Introduction',
    link: '/en/README'
  },
  {
    text: '1. Basic Usage',
    items: [
      { text: 'Introduction', link: '/en/README'},
      { text: 'Installation Guide', link: '/en/install' },
      { text: 'First Time Setup',
        items: [
          { text: 'Installing Windows on x86', link: '/en/setup/Windows-on-x86' },
          { text: 'Installing Linux on ARM64/Loongson', link: '/en/setup/Linux-on-port' },
          { text: 'Migrate from Proxmox VE', link: '/en/setup/Migrating-from-pve' }
        ]
      },
      { text: 'Resources Download', link: '/en/resources' },
      { text: 'Software Repository', link: '/en/repo' }
    ]
  },
  {
    text: '2. Feature Details',
    items: [
      { text: 'UI', link: '/en/ui'},
      { text: 'CLI', link: '/en/cli',
        items: [
          { text: 'qm', link: '/en/cli/qm' },
          { text: 'pvessh', link: '/en/cli/pvessh' },
          { text: 'pvebcache', link: '/en/cli/pvebcache' },
          { text: 'proxmox-boot-tool', link: '/en/cli/proxmox-boot-tool' },
        ]
      },
      { text: 'API', link: '/en/api' }
    ]
  },{
    text: '3. Use Cases',
    items: [
      { text: 'Ceph',link: '/en/case/ceph',
        items: [
          {text: '1. Deployment', link: '/en/case/ceph/deploy'},
          {text: '2. Maintenance', link: '/en/case/ceph/maintenance'},
        ]
      },
      { text: 'vGPU',
        items: [
          {text: '1. Nvidia vGPU', link: '/en/case/vgpu/nvgpu'},
          {text: '2. Moore Threads vGPU', link: '/en/case/vgpu/mthreads'},
        ]
      },
      { text: 'eNFS', link: '/en/case/enfs'},
      { text: 'SPDK', link: '/en/case/spdk'},
    ]
  }
]

// 日文侧边栏
const jaSidebar = [
  {
    text: '紹介',
    link: '/ja/README'
  },
  {
    text: '1. 基本的な使用方法',
    items: [
      { text: '紹介', link: '/ja/README'},
      { text: 'インストールヘルプ', link: '/ja/install' },
      { text: '初めての使用',
        items: [
          { text: 'x86でWindowsをインストール', link: '/ja/setup/Windows-on-x86' },
          { text: 'ARM64/Loongsonにlinuxをインストール', link: '/ja/setup/Linux-on-port' },
          { text: 'Proxmox VEから移行', link: '/ja/setup/Migrating-from-pve' }
        ]
      },
      { text: 'リソースダウンロード', link: '/ja/resources' },
      { text: 'ソフトウェアリポジトリ', link: '/ja/repo' }
    ]
  },
  {
    text: '2. 機能詳細',
    items: [
      { text: 'UI', link: '/ja/ui'},
      { text: 'CLI', link: '/ja/cli',
        items: [
          { text: 'qm', link: '/ja/cli/qm' },
          { text: 'pvessh', link: '/ja/cli/pvessh' },
          { text: 'pvebcache', link: '/ja/cli/pvebcache' },
          { text: 'proxmox-boot-tool', link: '/ja/cli/proxmox-boot-tool' },
        ]
      },
      { text: 'API', link: '/ja/api' }
    ]
  },{
    text: '3. ユースケース',
    items: [
      { text: 'Ceph',link: '/ja/case/ceph',
        items: [
          {text: '1. デプロイメント', link: '/ja/case/ceph/deploy'},
          {text: '2. メンテナンス', link: '/ja/case/ceph/maintenance'},
        ]
      },
      { text: 'vGPU',
        items: [
          {text: '1. Nvidia vGPU', link: '/ja/case/vgpu/nvgpu'},
          {text: '2. Moore Threads vGPU', link: '/ja/case/vgpu/mthreads'},
        ]
      },
      { text: 'eNFS', link: '/ja/case/enfs'},
      { text: 'SPDK', link: '/ja/case/spdk'},
    ]
  }
]

export default defineConfig({
  ignoreDeadLinks: true,
  title: "PXVIRT",
  description: "梨儿方 文档中心",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: zhNav,
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/README',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/README',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar
      }
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      link: '/ja/README',
      themeConfig: {
        nav: jaNav,
        sidebar: jaSidebar
      }
    }
  },
  markdown: {
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    }
  },
  head: [
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }
    ]
  ]
})
