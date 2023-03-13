# gRPC
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
type customCredentinal struct {
}

func (c customCredentinal) GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error) {
	fmt.Println("发送了请求")
	return map[string]string{
		"token": "xxxxxdfsdf",
	}, nil
}
func (c customCredentinal) RequireTransportSecurity() bool {
	return false
}

func main() {
	var opts []grpc.DialOption
	opts = append(opts, grpc.WithTransportCredentials(insecure.NewCredentials()))
	opts = append(opts, grpc.WithPerRPCCredentials(customCredentinal{})) // grpc.Dial 的第三个参数
	conn, _ := grpc.Dial("localhost:8080", opts...)
	defer conn.Close()
	client := hello.NewHelloServiceClient(conn)
	r, _ := client.SayHello(context.Background(), &hello.HelloRequest{Name: "shibin"}) // [!code ++]
	fmt.Println(r.Status)
}
```