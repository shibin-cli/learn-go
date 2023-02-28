# RPC
## 什么是 RPC

* RPC(Remote Procedure Call) 远程过程调用， 简单理解是一个节点请求另一个节点提供的服务
* 对应 RPC 的是本地过程调用，函数调用是最常见的本地过程调用
* 将本地过程变成远程过程调用会面临各种问题

## 远程过程面临的问题

本地函数放到另一个服务器上去运行，但是会引入很多新问题

* Call 的 id 映射
* 序列化和反序列化
* 网络传输

## 快速体验 RPC
服务端
```go
package main

import (
	"net"
	"net/rpc"
)

type HelloService struct {
}

func (s *HelloService) Hello(request string, reply *string) error {
	*reply = "Hello," + request
	return nil
}
func main() {
	// 注册一个 server
	listener, _ := net.Listen("tcp", ":8080")
	// 注册处理逻辑
	err := rpc.RegisterName("HelloService", &HelloService{})
	if err != nil {
		return
	}
	// 启动服务
	conn, _ := listener.Accept()
	rpc.ServeConn(conn)
}
```

客户端

```go
package main

import (
	"fmt"
	"net/rpc"
)

func main() {
	client, err := rpc.Dial("tcp", "localhost:8080")
	if err != nil {
		panic("连接失败")
	}
	var reply *string = new(string)
	err = client.Call("HelloService.Hello", "Shibin", reply)
	if err != nil {
		panic("调用失败")
	}
	fmt.Println(*reply) // Hello,Shibin
}
```