# RPC

## 什么是 RPC

* RPC(Remote Procedure Call) 远程过程调用， 简单理解是一个节点请求另一个节点提供的服务
* 对应 RPC 的是本地过程调用，函数调用是最常见的本地过程调用
* 将本地过程变成远程过程调用会面临各种问题

下面是一段 python 代码， 服务端注册一个 `hello` 方法
```py
import zerorpc

class HelloRPC(object):
    def hello(self, name):
        return "Hello, %s" % name

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:3000")
s.run()
```
在客户端，连接到服务端后，就可以直接调用服务端的  `hello` 方法
```py
import zerorpc

c = zerorpc.Client()
c.connect("tcp://localhost:3000")
print(c.hello("Shibin")) # Hello, Shibin
```
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
## 替换 RPC 序列化协议
上面客户端调用有点麻烦，直接使用 `client.Hello` 调用呢

如果要实现跨语言调用，首先需要了解
* Go 语言的 RPC 的序列化和反序列化的协议是什么(Gob)
* 能否换成常见的序列化协议。如 JSON

下面将数据改成 json 传输
### 服务端
```go
package main

import (
	"net"
	"net/rpc"
	"net/rpc/jsonrpc"
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

	for {
		conn, _ := listener.Accept()
		go rpc.ServeCodec(jsonrpc.NewServerCodec(conn))
	}
}

```

### 客户端

```go
package main

import (
	"fmt"
	"net"
	"net/rpc"
	"net/rpc/jsonrpc"
)

func main() {
	client, err := net.Dial("tcp", "localhost:8080")
	if err != nil {
		panic("连接失败")
	}
	var reply string
	newClient := rpc.NewClientWithCodec(jsonrpc.NewClientCodec(client))
	err = newClient.Call("HelloService.Hello", "Shibin", &reply)
	if err != nil {
		panic("调用失败")
	}
	fmt.Println(reply)
}
```
使用 python 发送请求
```py
import json
import socket

request = {
    "id": 0,
    "params": ["Shibin"],
    "method": "HelloService.Hello"
}
client = socket.create_connection(("localhost", "8080"))
# 发送请求
client.send(json.dumps(request).encode())
# 接收请求
res = client.recv(4096)
# 数据转化为json
json = json.loads(res.decode())  
print(json)
```

nodejs 发送请求
```ts
import net from 'net'

const data = {
  id: 0,
  params: ['Shibin'],
  method: 'HelloService.Hello'
}
const client = net.createConnection({
  port: 8080,
  host: '10.24.118.170'
}, () => {
  console.log('connected to server!')
  client.write(JSON.stringify(data))
})
client.on('data', (data) => {
  console.log(data.toString()) // {"id":0,"result":"Hello,Shibin","error":null}
  client.end()
})
client.on('end', () => {
  console.log('disconnected from server')
})
```
## 替换 RPC 传输协议

将传输协议替换为 [http](https://developer.mozilla.org/zh-CN/docs/Web/HTTP) 协议
### 服务端
```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"net/rpc"
	"net/rpc/jsonrpc"
)

type HelloService struct {
}

func (s *HelloService) Hello(request string, reply *string) error {
	*reply = "Hello," + request
	return nil
}
func main() {
	// 注册处理逻辑
	err := rpc.RegisterName("HelloService", &HelloService{})
	if err != nil {
		return
	}
	// server
	http.HandleFunc("/json", func(w http.ResponseWriter, r *http.Request) {
		var conn io.ReadWriteCloser = struct {
			io.Writer
			io.ReadCloser
		}{
			ReadCloser: r.Body,
			Writer:     w,
		}
		rpc.ServeRequest(jsonrpc.NewServerCodec(conn))
	})
	http.ListenAndServe(":8080", nil)
}

```

### 客户端

下面使用 python 代码测试
```py
import requests

request = {
    "id": 0,
    "params": ["body"],
    "method": "HelloService.Hello"
}

res = requests.post("http://localhost:8080/json", json=request)
print(res.text) # {"id":0,"result":"Hello,body","error":null}
```
也可以使用 nodejs 调用
```ts
import axios from 'axios'

axios.post('http://localhost:8080/json', {
  id: 0,
  params: ['shibin'],
  method: 'HelloService.Hello'
}).then(res => {
  console.log(res.data) // { id: 0, result: 'Hello,shibin', error: null }
})
```