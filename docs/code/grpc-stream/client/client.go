package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"rpc_demo/stream/proto"
	"sync"
	"time"
)

func main() {
	conn, _ := grpc.Dial("localhost:8080", grpc.WithTransportCredentials(insecure.NewCredentials()))
	defer conn.Close()

	c := stream.NewStreamClient(conn)

	getRes, _ := c.GetStream(context.Background(), &stream.StreamReqData{
		Data: "Hehe",
	})
	for {
		data, err := getRes.Recv()
		fmt.Println(data)
		if err != nil {
			break
		}
	}
	putRes, _ := c.PutStream(context.Background())
	i := 0
	for {
		if i > 10 {
			break
		}
		putRes.Send(&stream.StreamReqData{
			Data: fmt.Sprintf("Hello, %d", i),
		})
		i++
		time.Sleep(time.Second)
	}

	allRes, _ := c.AllStream(context.Background())
	wg := sync.WaitGroup{}
	wg.Add(2)
	go func() {
		defer wg.Done()
		i := 0
		for {
			allRes.Send(&stream.StreamReqData{
				Data: fmt.Sprintf("Hello, %d", i),
			})
			time.Sleep(time.Second)
			i++
		}
	}()
	go func() {
		defer wg.Done()
		for {
			data, _ := allRes.Recv()
			fmt.Println(data)
		}
	}()
	wg.Wait()
}
