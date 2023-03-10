# 开始

Go 语言官网 https://go.dev

中文官网  https://golang.google.cn
## 下载
* [Golang](https://golang.google.cn/dl/)
* 开发工具（选择其中一个就行）
  * [Goland](https://www.jetbrains.com/go/) 
  * [Vscode](https://code.visualstudio.com/)

## 设置 Go Proxy

输入 go env 查看配置信息

```bash
go env
```

可以使用 `go env -w xxx=xxx` 修改配置信息

```bash
go env -w xxx=xxx
```
### Go Modules

使用 go modules 管理依赖

```bash
go env -w  GO111MODULE=on  # 默认为 auto
```

::: details 如果我们要使用 gopath 模式，需要 GO111MODULE 设置为 off 
``` bash
go env -w  GO111MODULE=off
```
:::

尽量不要使用 go path 模式

### 设置国内镜像源

```bash
go env -w GOPROXY=https://goproxy.cn,direct
```

## 相关书籍

[Go语言圣经](https://gopl-zh.github.io)