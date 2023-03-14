# gRPC
[gRPC](https://grpc.io) github 地址 https://github.com/grpc/grpc
## metadata
```go
package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata" // [!code ++]

	"rpc_demo/metadata/proto"
)

func main() {
	conn, _ := grpc.Dial("localhost:8080", grpc.WithTransportCredentials(insecure.NewCredentials()))
	defer conn.Close()
	client := hello.NewHelloServiceClient(conn)
	md := metadata.New(map[string]string{ // [!code ++]
		"name":     "shibin", // [!code ++]
		"password": "123456", // [!code ++]
	}) // [!code ++]
	ctx := metadata.NewOutgoingContext(context.Background(), md)                       // [!code ++]
	r, _ := client.SayHello(ctx, &hello.HelloRequest{Name: "shibin"})                  // [!code ++]
	r, _ := client.SayHello(context.Background(), &hello.HelloRequest{Name: "shibin"}) // [!code --]
	fmt.Println(r.Status)
}
```
服务端获取 metadata
```go
func (s *Server) SayHello(ctx context.Context, req *hello.HelloRequest) (*hello.HelloResponse, error) {
	md, ok := metadata.FromIncomingContext(ctx) // [!code ++]
	if ok { // [!code ++]
		for key, val := range md { // [!code ++]
			fmt.Println(key, val) // [!code ++]
		} // [!code ++]
	} // [!code ++]

	return &hello.HelloResponse{
		Status: 1,
	}, nil
}
```
## 拦截器
### 服务端
可以通过 `grpc.NewServer` 传递拦截器
```go
func interceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) { // [!code ++]
	md, ok := metadata.FromIncomingContext(ctx) // [!code ++]
	if !ok { // [!code ++]
		return resp, status.Error(codes.Unauthenticated, "无 token 认证信息") // [!code ++]
	} // [!code ++]
	var token string // [!code ++]
	if val, ok := md["token"]; ok { // [!code ++]
		token = val[0] // [!code ++]
	} // [!code ++]
	fmt.Println("token", token) // [!code ++]
	res, err := handler(ctx, req) // [!code ++]
	fmt.Println(time.Now()) // [!code ++]
	return res, err // [!code ++]
} // [!code ++]

func main() {
	s := grpc.NewServer(grpc.UnaryInterceptor(interceptor)) // [!code ++]
	s :=  grpc.NewServer() // [!code --]
	hello.RegisterHelloServiceServer(s, &Server{})
	serve, _ := net.Listen("tcp", "0.0.0.0:8080")
	_ = s.Serve(serve)
}
```
### 客户端
可以通过 `grpc.Dial` 的第三个参数来传递拦截器
```go
...
func main() {
	interceptor := func(ctx context.Context, method string, req, reply interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error { // [!code ++]
		fmt.Println("发送了请求") // [!code ++]
		err := invoker(ctx, method, req, reply, cc, opts...) // [!code ++]
		fmt.Println(time.Now()) // [!code ++]
		return err // [!code ++]
	} // [!code ++]

	conn, _ := grpc.Dial("localhost:8080", grpc.WithTransportCredentials(insecure.NewCredentials()), grpc.WithUnaryInterceptor(interceptor)) // [!code ++]
	conn, _ := grpc.Dial("localhost:8080", grpc.WithTransportCredentials(insecure.NewCredentials())) // [!code --]
	defer conn.Close()
	client := hello.NewHelloServiceClient(conn)
	r, _ := client.SayHello(context.Background(), &hello.HelloRequest{Name: "shibin"})
	fmt.Println(r.Status)
}
```
也可以使用下面的方式
```go
type customCredentinal struct { // [!code ++]
} // [!code ++]

func (c customCredentinal) GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error) { // [!code ++]
	fmt.Println("发送了请求") // [!code ++]
	return map[string]string{ // [!code ++]
		"token": "xxxxxdfsdf", // [!code ++]
	}, nil // [!code ++]
} // [!code ++]
func (c customCredentinal) RequireTransportSecurity() bool { // [!code ++]
	return false // [!code ++]
} // [!code ++]

func main() {
	var opts []grpc.DialOption // [!code ++]
	opts = append(opts, grpc.WithTransportCredentials(insecure.NewCredentials()))  // [!code ++]
	opts = append(opts, grpc.WithPerRPCCredentials(customCredentinal{})) // grpc.Dial 的第三个参数 // [!code ++]
	conn, _ := grpc.Dial("localhost:8080", opts...)
	defer conn.Close()
	client := hello.NewHelloServiceClient(conn)
	r, _ := client.SayHello(context.Background(), &hello.HelloRequest{Name: "shibin"}) 
	fmt.Println(r.Status)
}
```
## 验证器
我们在 proto 文件中可以通过类型来限制传递数据的类型，但不能限制数据类型的长度、大小等。比如用户传递的用户名必须是 3-10 位等，这时我们就需要使用验证器

验证器可以使用 [protoc-gen-validate](https://github.com/bufbuild/protoc-gen-validate)

### protoc-gen-validate 下载
* [windows下载地址](https://oss.sonatype.org/content/repositories/snapshots/io/envoyproxy/protoc-gen-validate/protoc-gen-validate/) ，打开后选择对应版本进行下载。下载后将 .exe 拷贝到 GOPATH 目录下的 bin 文件中，可以使用 `go env` 命令查看 GOPATH 目录
* Mac 和 Linux 可以从 [GitHub Releases 下载](https://github.com/bufbuild/protoc-gen-validate/releases) ，也可以使用下面命令
```bash
# fetches this repo into $GOPATH
go get -d github.com/envoyproxy/protoc-gen-validate
# installs PGV into $GOPATH/bin
make build
```
### 使用
可以从 github 上 [validate/validate.proto](https://github.com/bufbuild/protoc-gen-validate/blob/main/validate/validate.proto) 将 proto 文件拷贝到项目中
::: details 也可以拷贝下面 proto 代码到项目文件中
<<< @/code/validate/validate.proto
:::
然后在项目中导入 validate.proto 文件
```proto {3}
syntax = "proto3";
import "validate.proto"; 
option go_package = "./;user";

message Person {
	// 邮箱校验
  string email = 2 [(validate.rules).string.email = true];
	// 名字 3-20 位
  string name = 3 [(validate.rules).string = {
    min_len: 3,
    max_len: 20
  }];
}
```
具体验证规则可以在 [github 上查看](https://github.com/bufbuild/protoc-gen-validate#constraint-rules)

编译 proto 文件
```bash
 protoc --go_out=. \
 --go-grpc_out=require_unimplemented_servers=false:. \
 --validate_out=lang=go:. user.proto
```
在服务端使用，可以在拦截器中使用 validate
```go
package main

import (
	"fmt"
	"context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"net"
	"rpc_demo/validate/protoc"
)

type Server struct {
}

func (s *Server) SayHello(context context.Context, req *user.Person) (*user.Person, error) {
	return req, nil
}

type Validator interface {
	Validate() error
}

func main() {
	interceptor := func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		if r, ok := req.(Validator); ok {
			if err := r.Validate(); err != nil {
				return nil, status.Error(codes.InvalidArgument, err.Error())
			}
		}
		return handler(ctx, req)
	}
	g := grpc.NewServer(grpc.UnaryInterceptor(interceptor))
	user.RegisterUserServer(g, &Server{})
	lis, _ := net.Listen("tcp", "localhost:8080")
	g.Serve(lis)
}
```

## 状态码

grpc 状态码说明 https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

## 异常处理
### 错误处理
```go
func main() {
	interceptor := func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		if r, ok := req.(Validator); ok {
			if err := r.Validate(); err != nil {
				return nil, status.Error(codes.InvalidArgument, err.Error())
			}
		}
		return handler(ctx, req)
	}
	g := grpc.NewServer(grpc.UnaryInterceptor(interceptor))
	user.RegisterUserServer(g, &Server{})
	lis, _ := net.Listen("tcp", "localhost:8080")
	g.Serve(lis)
}
```

客户端获取错误信息

```go
func main() {
	conn, _ := grpc.Dial("localhost:8080", grpc.WithTransportCredentials(insecure.NewCredentials()))

	defer conn.Close()
	client := user.NewUserClient(conn)

	r, err := client.SayHello(context.Background(), &user.Person{
		Email: "aaa@qq.com",
		Name:  "a",
	})
	if err != nil {
		if st, ok := status.FromError(err); ok {
			fmt.Println(st.Message())
		}
	}
	fmt.Println(r)
}
```
### 超时机制