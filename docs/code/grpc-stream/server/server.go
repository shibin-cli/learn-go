package main

import (
	"fmt"
	"google.golang.org/grpc"
	"net"
	"rpc_demo/stream/proto"
	"sync"
	"time"
)

type Server struct {
}

func (s *Server) GetStream(req *stream.StreamReqData, res stream.Stream_GetStreamServer) error {
	fmt.Println(req.Data)
	i := 0
	for {
		i++
		res.Send(&stream.StreamResData{
			Data: fmt.Sprintf("服务端流模式，%d", i),
		})
		time.Sleep(time.Second)
		if i > 10 {
			break
		}
	}
	return nil
}
func (s *Server) PutStream(req stream.Stream_PutStreamServer) error {
	for {
		data, err := req.Recv()
		if err != nil {
			break
		}
		fmt.Println(data)
	}
	return nil
}
func (s *Server) AllStream(res stream.Stream_AllStreamServer) error {
	wg := sync.WaitGroup{}

	wg.Add(2)
	go func() {
		defer wg.Done()
		for {
			data, err := res.Recv()
			fmt.Println(data)
			if err != nil {
				break
			}
		}
	}()
	go func() {
		defer wg.Done()
		i := 0
		for {
			i++
			res.Send(&stream.StreamResData{Data: fmt.Sprintf("服务端信息 %d", i)})
			time.Sleep(time.Second)
		}
	}()
	wg.Wait()
	return nil
}
func main() {
	s := grpc.NewServer()
	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		panic(err)
	}
	stream.RegisterStreamServer(s, &Server{})
	_ = s.Serve(lis)
}
