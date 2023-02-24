import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Go学习',
  description: 'Go基础学习',
  base:'/learn-go/',
  head: [['meta', { name: 'theme-color', content: '#3c8772' }]],

  themeConfig: {
    sidebar: {
      '/base/': sidebarBase(),
    },
    nav: nav(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shibin-cli/learn-go' }
    ],
    editLink: {
      pattern: 'https://github.com/shibin-cli/learn-go/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    outline: 'deep',
    outlineTitle:'本页目录',
  },
})

function sidebarBase(){
  return [
    {
      text: '理解rpc',
      collapsed: true,
      items: [
        { text: '开始', link: '/base/start.md' },
        { text: '编码规范', link: '/base/coding-specification.md' },
      ]
  }]
}

function nav() {
  return [
    { text: '基础', link: '/base/coding-specification.md', activeMatch: '/base/' },
  ]
} 