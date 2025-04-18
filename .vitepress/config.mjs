import { defineConfig } from 'vitepress'
export default defineConfig({
    ignoreDeadLinks: true,
    title: "PXVIRT",
    description: "梨儿方 文档中心",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: 'Home', link: '/index.md' },
        { text: '梨儿方', link: 'https://www.lierfang.com' },
        { text: 'PXVDI文档', link: 'https://docs.pvdi.lierfang.com' },
      ],
      search: {
        provider: 'local'
      },
      sidebar: [
        {
          text: '介绍',
          link: 'README'
          // items: [
          //   { text: '介绍', link: '/zh/README' },
          //   { text: 'Runtime API Examples', link: '/api-examples' }
          // ]
        },
        {
          text: '一 基本使用',
          items: [
             { text: '介绍', link: 'README'},
             { text: '安装帮助', link: 'install' },
             { text: '初次使用',
                items: [
                    { text: '在x86上安装windows', link: 'setup/Windows-on-x86' },
                    { text: '在arm64/龙芯上安装Linux', link: 'setup/Linux-on-port' }
                ]
             },
             { text: '资源下载', link: 'resources' },
             { text: '软件仓库', link: 'repo' }
          ]
        },
        {
          text: '二 功能详情',
          items: [
             { text: 'UI', link: 'ui'},
             { text: 'CLI', link: 'cli',
                items: [
                    { text: 'qm', link: 'cli/qm' },
                    { text: 'pvessh', link: 'cli/pvessh' },
                    { text: 'pvebcache', link: 'cli/pvebcache' },
                    { text: 'proxmox-boot-tool', link: 'cli/proxmox-boot-tool' },
                ]
             },
             { text: 'API', link: 'api.md' }
          ]
        },{
            text: '三 案例',
            items: [
                { text: 'Ceph',
                    items: [
                        {text: '1. 部署', link: 'case/ceph/deploy'},
                        {text: '2. 运维', link: 'case/ceph/maintenance'},
                    ]
                },
                { text: 'vGPU', 
                    items: [
                        {text: '1. Nvidia vGPU', link: 'case/vgpu/nvgpu'},
                        {text: '2. 摩尔线程 vGPU', link: 'case/vgpu/mthreads'},
                    ]
                },
            ]
        }

      ],
  
      socialLinks: [
        { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
      ]
    },
    locales: {
      root: {
        label: '简体中文',
        lang: 'zh-CN'
        },
      en: {
        label: 'English',
        lang: 'en', 
        link: '/en/'
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