# 编码规范

## 为什么需要代码规范

1. 代码规范不是强制的，也就是你不遵循代码规范写出来的代码运行也是完全没有问题的
2. 代码规范目的是方便团队形成一个统一的代码风格，提高代码的可读性，规范性和统一性。本规范将从命名规范，注释规范，代码风格和 Go 语言提供的常用的工具这几个方面做一个说明。
3. 规范并不是唯一的，也就是说理论上每个公司都可以制定自己的规范，不过一般来说整体上规范差异不会很大。

## 命名规范

命名是代码规范中很重要的一部分，统一的命名规则有利于提高的代码的可读性，好的命名仅仅通过命名就可以获取到足够多的信息

* 当命名（包括常量、变量、类型、函数名、结构字段等等）以一个**大写字母开头**，如：Group1，那么使用这种形式的标识符的对象就可以被**外部包**的代码所使用（客户端程序需要先导入这个包），这被称为导出（像面向对象语言中的 public）
* 命名如果以**小写字母开头**，则对包外是**不可见**的，但是他们在整个包的内部是可见并且可用的（像面向对象语言中的 private ）

### 包名

保持 **package 的名字**和**目录**保持**一致**，尽量采取有意义的包名，简短，有意义，尽量和标准库不要冲突。包名应该为**小写**单词，不要使用下划线或者混合大小写。

```go
package clac

func add(a, b int) int {
    return a + b
}
...
```

### 文件名

尽量采取有意义的文件名，简短，有意义，应该为**小写**单词，使用**下划线**分隔各个单词

```go
user_model.go
```

### 结构体命名

* 采用驼峰命名法，首字母根据访问控制大写或者小写
* `struct` 声明和初始化格式采用多行

```go
// 多行声明
type User struct{
    Username  string
    Email     string
    age       number
}
 
// 多行初始化
u := User{
    Username: "bobby",
    Email:    "shibin@xxx.com",
    age: 17
}
```

### 接口命名

* 接口命名规则和结构体一样
* 单个函数的结构提名以 `er` 最为后缀，例如 `Reader` 、`Writer`

```ts
type Reader interface {
    Read(p []byte) (n int, err error)
}
```

### 变量命名

遵循驼峰法， 首字母根据访问控制原则大写或者小写。但遇到特有名词时，需要遵循以下规则：

* 如果变量为私有，且特有名词为首个单词，则使用小写，如 `apiClient`
* 其它情况都应当使用该名词原有的写法，如 `APIClient`、`repoID`、`UserID`
  * 错误示例：`UrlArray`，应该写成 `urlArray` 或者 `URLArray`
* 若变量类型为 `bool` 类型，则名称应以 `Has`, `Is`, `Can` 或 `Allow` 开头

### 常量命名

全部大写字母组成，并使用下划线分割

```go
const APP_VERSION = "1.0"
```

## 注释

* 单行注释  `//`
* 多行注释 `/* */`

### 函数注释

```go
/*
两数相加

参数：

	a  加数
	b 被加数

return

	相加的结果
*/
func add(a, b int) int {
	return a + b
}
```

### 代码逻辑注释

对于一些关键位置的代码逻辑，或者局部较为复杂的逻辑，需要有相应的逻辑说明，方便其他开发者阅读该段代码
### 包注释

* 包的基本简介
* 创建者
  * 创建人：名字
* 创建时间
  * 创建时间： yyyyMMdd

### 接口注释

每个自定义的结构体或者接口都应该有注释说明，该注释对结构进行简要介绍，放在结构体定义的前一行

格式为： 结构体名， 结构体说明

### 注释风格

统一采用中文（或英文注释），中英文字符之间严格采用空格分隔，英文和中文标点之间也要使用空格分隔

单行注释不要过长，不要超过 120 个字符

## import 规范

### import 格式

`import` 在多行的情况下，`goimports` 会自动帮你格式化，如果你在一个文件里面引入了一个 `package`，还是建议采用如下格式：

```go
import (
    "fmt"
)
```

### 包引入顺序

如果你的包引入了三种类型的包，标准库包，程序内部包，第三方包。需要按照下面顺序引入

* 标准库包
* 第三方包
* 程序内部包

如果是引入本项目中的其他包，最好使用**相对路径**

## 错误处理

* 错误处理的原则就是不能丢弃任何有返回 err 的调用，不要使用 _ 丢弃，必须全部处理。接收到错误，要么返回 err，或者使用 log 记录下来
* 尽早 `return`：一旦有错误发生，马上返回
* 尽量不要使用 `panic`，除非你知道你在做什么
* 错误描述如果是**英文**必须为**小写**，**不需要**标点结尾
* 采用独立的错误流进行处理
