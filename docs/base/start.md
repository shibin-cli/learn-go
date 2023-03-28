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
## 常用命令
### go get
`go get` 用来安装第三方的依赖包
```bash
go get github.com/gin-gonic/gin
```
如果本地已有该依赖包，可以通过 `-u` 来拉取最新依赖代码
```bash
# 与不加 -u 的区别：本地已有该依赖包时，会拉取最新依赖，不加不会
go get -u github.com/gin-gonic/gin
```
### go mod
查看 `go mod` 下的命令
```bash
go mod help
```
常用命令
```bash
# 初始化  go mod 文件
go mod init

# 安装使用的依赖并删除无用的依赖包
go mod tidy
```
## 相关书籍

[Go语言圣经](https://gopl-zh.github.io)
