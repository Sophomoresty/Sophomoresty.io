import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Sophomores 的博客',
  description: '记录学习与生活 - 深度学习、编程、生活随笔',
  lang: 'zh-CN',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '关于', link: '/about/' }
    ],

    sidebar: {
      '/blog/': [
        {
          text: '文章',
          items: [
            { text: '所有文章', link: '/blog/index.md' }
          ]
        }
      ]
    },

    social: [
      { icon: 'github', link: 'https://github.com/Sophomoresty' }
    ],

    footer: {
      message: '用 💖 记录生活',
      copyright: 'Copyright © 2024-present Sophomores'
    },

    search: {
      provider: 'local'
    }
  }
})
