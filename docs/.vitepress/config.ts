import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Go学习',
  description: 'Go基础学习',
  base: '/learn-go/',
  head: [['meta', { name: 'theme-color', content: '#3c8772' }]],
  themeConfig: {
    algolia: {
      appId: '16LHHYNQFO',
      apiKey: '06eb22f1a9b225356ab3099b6de09b22',
      indexName: 'learn-go',
    },
    sidebar: {
      '/base/': sidebarBase(),
    },
    logo: '/go-logo-blue.svg',
    nav: nav(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shibin-cli/learn-go' }
    ],
    editLink: {
      pattern: 'https://github.com/shibin-cli/learn-go/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    outline: 'deep',
    outlineTitle: '本页目录',
  },
})

function sidebarBase() {
  return [
    {
      text: '开始',
      collapsed: true,
      items: [
        { text: '开始', link: '/base/start.md' },
        { text: '接口', link: '/base/interface.md' },
        { text: '编码规范', link: '/base/coding-specification.md' },
      ]
    },
    {
      text: '理解 RPC',
      collapsed: true,
      items: [
        { text: 'RPC', link: '/base/rpc/rpc.md' },
        { text: 'gRPC 入门', link: '/base/rpc/grpc-start.md' },
        { text: 'protobuf', link: '/base/rpc/protobuf.md' },
        { text: 'gRPC', link: '/base/rpc/grpc.md' },
      ]
    }]
}

function nav() {
  return [
    { text: '基础', link: '/base/coding-specification.md', activeMatch: '/base/' },
  ]
} 