# gRPC
## 什么是 gRPC
[gRPC](https://grpc.io) 是一个高性能、开源和通用的 RPC 框架，面向移动和 HTTP/2 设计的。目前提供 C、Java 和 Go 语言版本，分别是：[grpc](https://github.com/grpc/grpc) 、 [grpc-java](https://github.com/grpc/grpc-java) 、 [grpc-go](https://github.com/grpc/grpc-go) 。其中 C 版本支持 C 、 C++ 、 Node.js 、 Python 、 Ruby 、 Objective-C 、 PHP 和 C# 支持.

gRPC 文档地址 https://grpc.io/docs/

go gRPC 文档地址 https://grpc.io/docs/languages/go/quickstart/
## 什么是 protobuf
[Protocol Buffer](https://protobuf.dev) （又名 protobuf）  是 Google出品的一种轻量高效的结构化数据存储格式。支持多种不同的编程语言

protobuf 的优点
* 性能
  * 压缩性好
  * 序列化和反序列化快 (比 json 、xml 快 2-100 倍)
  * 传输速度快
* 便携性
  * 使用简单 （自动序列化和反序列化）
  * 维护成本低 （只维护 proto 文件）
  * 向后兼容
  * 加密性好
* 跨语言

缺点
* 通用性差  （需要专门的 protobuf 库解析）
* 自解释性差 （只能通过 proto 文件才能了解数据结构）
## gRPC 环境搭建

### 安装 protoc
#### Mac
Mac 系统可以通过 brew 安装
```bash
brew install protoc
```
#### Win
Win 下，打开 https://github.com/protocolbuffers/protobuf/releases ，下载指定的版本

下面需要配置环境变量 ，将下载的 protobuf 文件中的 bin 目录下 protoc.exe 的添加到环境变量中
* 鼠标右键此电脑属性
* 点击 系统 -> 高级系统设置 -> 环境变量
* 点击系统变量中的 Path, 将 bin 目录添加的环境变量中

### 安装 grpc-go

可以参考 https://grpc.io/docs/languages/go/quickstart/ 进行安装

```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
```

然后需要配置下环境变量

```bash
export PATH="$PATH:$(go env GOPATH)/bin"
```
## 编写 proto 文件
```proto
syntax = "proto3"; // 指定使用的proto版本
option go_package = "./;hello"; // 指定 go package

message HelloRequest {
  string name = 1; // 1 是编号不是值
  int32 age = 2; //   2 编号
}
```
编译 proto 文件
```bash
protoc --go_out=.  hello.proto
```
会生成一个 hello.pb.go 文件
## protobuf 和 json 对比

导入上面生成的 hello.pb.go 文件

```go
package main

import (
	"encoding/json"
	"fmt"
	"github.com/golang/protobuf/proto"
	hello "rpc_demo/protobuf"
)

func main() {
	req := hello.HelloRequest{
		Name:    "shibin",
		Age:     17,
		Courses: []string{"go", "gin"},
	}
	res, _ := proto.Marshal(&req)
	// res, _ := json.Marshal(&req)
	fmt.Println(len(res)) // // 19

	req1 := hello.HelloRequest{
		Name:    "shibin",
		Age:     17,
		Courses: []string{"go", "gin"},
	}
	jsonRes, _ := json.Marshal(&req1)
	fmt.Println(len(jsonRes)) // 49
}
```
通过打印长度，可以发现 protobuf 比 json 长度少了一倍多
```go
	newReq := hello.HelloRequest{}
	_ = proto.Unmarshal(res, &newReq)
	fmt.Println(newReq.Name, newReq.Age, newReq.Courses)
```

protobuf 反序列化

```go
package main

import (
	"fmt"
	"github.com/golang/protobuf/proto"
	hello "rpc_demo/protobuf"
)

func main() {
	req := hello.HelloRequest{
		Name:    "shibin",
		Age:     17,
		Courses: []string{"go", "gin"},
	}
	res, _ := proto.Marshal(&req)
	newReq := hello.HelloRequest{}
	_ = proto.Unmarshal(res, &newReq)
	fmt.Println(newReq.Name, newReq.Age, newReq.Courses) // shibin 17 [go gin]
}
```

## gRPC 体验
### proto 文件

```proto
syntax = "proto3";
option go_package = "./;hello";

message HelloRequest {
  string name = 1;
  int32 age = 2;
}
// grpc 解析的 // [!code ++]
service HelloResponse { // [!code ++]
  rpc SayHello(HelloRequest) returns (Response); // SayHello 接口  // [!code ++]
} // [!code ++]
message  Response{
  string  message = 1;
}
```
grpc 在 proto 增加了 service 这个语法， 在 service 中定义一个 SayHello 接口

执行下面命令，编译 proto 文件

```bash
protoc --go_out=. --go-grpc_out=require_unimplemented_servers=false:. hello.proto 
```
会生成 hello.pb.go 和 hello_grpc.pb.go 两个文件。hello_grpc.pb.go 文件中就有服务端和客户端的接口，我们在服务端和客户端可以直接调用

::: tip 注意
如果不加 `go-grpc_out` 这个参数, 就只会生成 hello.pb.go 一个文件。只会生成 protobuf 相关的文件，不会生成 grpc 相关的文件。 `go-grpc_out` 就是为了生成 grpc 相关的文件
:::
### 服务端
首先编写我们服务的实现
```go
type Server struct {
}

func (c *Server) SayHello(ctx context.Context, request *hello.HelloRequest) (*hello.Response, error) {
	message := fmt.Sprintf("Hello, %s,age %d", request.Name, request.Age)
	return &hello.Response{
		Message: message,
	}, nil
}
```
要构建和启动服务器
```go
func main() {
	// 注册 grpc服务器实例
	g := grpc.NewServer()
	// 向 grpc 注册我们的服务实现
	hello.RegisterHelloResponseServer(g, &Server{})
	// 监听客户端发送的请求
	lis, err := net.Listen("tcp", "0.0.0.0:8080")
	if err != nil {
		panic("faild: " + err.Error())
	}
	// 使用监听端口的信息调用 grpc 的服务
	err = g.Serve(lis)
	if err != nil {
		panic(err)
	}
}
```
### 客户端
```go
package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"rpc_demo/grpc/protoc"
)

func main() {
	// 建立链接
	conn, err := grpc.Dial("127.0.0.1:8080", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	// 建立 client 连接
	c := hello.NewHelloResponseClient(conn)
	// 调用服务端的方法
	r, err := c.SayHello(context.Background(), &hello.HelloRequest{Name: "shibin1", Age: 17})
	if err != nil {
		panic(err)
	}
	fmt.Println(r.Message)
}
```
### 完整代码
::: code-group
```go [server.go]
package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"net"

	"rpc_demo/grpc/hello" // 导入编译生成的 package hello
)

type Server struct {
}

func (c *Server) SayHello(ctx context.Context, request *hello.HelloRequest) (*hello.Response, error) {
	message := fmt.Sprintf("Hello, %s,age %d", request.Name, request.Age)
	return &hello.Response{
		Message: message,
	}, nil
}
func main() {
	g := grpc.NewServer()
	hello.RegisterHelloResponseServer(g, &Server{})

	lis, err := net.Listen("tcp", "0.0.0.0:8080")
	if err != nil {
		panic("faild: " + err.Error())
	}
	g.Serve(lis)
}
```
```go [client.go]
package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	"rpc_demo/grpc/hello"
)

func main() {
	conn, err := grpc.Dial("127.0.0.1:8080", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	defer conn.Close()
	c := hello.NewHelloResponseClient(conn)
	r, err := c.SayHello(context.Background(), &hello.HelloRequest{Name: "shibin1", Age: 17})
	if err != nil {
		panic(err)
	}
	fmt.Println(r.Message)
}
```
```go [hello.proto]
syntax = "proto3";
option go_package = "./;hello";

message HelloRequest {
  string name = 1;
  int32 age = 2;
}
service HelloResponse{
  rpc SayHello(HelloRequest) returns (Response); // Hello 接口
}
message  Response{
  string  message = 2;
}
```
:::