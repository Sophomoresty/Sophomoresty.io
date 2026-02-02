import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Sophomores 的博客',
  description: '记录学习与生活 - 深度学习、编程、生活随笔',
  lang: 'zh-CN',
  base: '/',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '分类', link: '/blog/categories/' },
      { text: '标签', link: '/blog/tags/' },
      { text: '关于', link: '/about/' }
    ],

    sidebar: {
      '/blog/': [
        {
          text: '📂 分类浏览',
          items: [
            { text: '全部分类', link: '/blog/categories/' },
            { text: '全部标签', link: '/blog/tags/' }
          ]
        },
        {
          text: '📚 学习笔记',
          collapsible: true,
          items: [
            {
              text: '深度学习',
              collapsible: true,
              items: [
                { text: '深度学习', link: '/blog/deep-learning/深度学习.md' },
                { text: '深度学习第二节', link: '/blog/deep-learning/深度学习_第二节课.afx' }
              ]
            },
            {
              text: 'NLP',
              collapsible: true,
              items: [
                { text: 'NLP', link: '/blog/nlp/NLP.md' },
                { text: 'NLP项目', link: '/blog/nlp/NLP项目.md' }
              ]
            },
            {
              text: '数据库',
              collapsible: true,
              items: [
                { text: '数据库系统(上)', link: '/blog/database/数据库系统_上.md' },
                { text: '数据库问答', link: '/blog/database/数据库问答.md' }
              ]
            },
            {
              text: '算法',
              collapsible: true,
              items: [
                { text: '力扣算法刷题', link: '/blog/algorithm/力扣算法刷题.md' },
                { text: '环形链表II', link: '/blog/algorithm/8_142.环形链表II.afx' },
                { text: '苏小红习题', link: '/blog/algorithm/苏小红习题.md' }
              ]
            },
            {
              text: 'Python',
              collapsible: true,
              items: [
                { text: 'Python关键词问题', link: '/blog/python/Python关键词问题.md' }
              ]
            }
          ]
        },
        {
          text: '🚀 项目实践',
          collapsible: true,
          items: [
            { text: 'ChatChat 项目部署', link: '/blog/project/chatchat项目部署.md' }
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
