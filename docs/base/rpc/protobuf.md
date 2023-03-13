# protobuf
protobuf 官网文档 https://protobuf.dev/programming-guides/proto3/

## 数据类型
### 基本数据类型
|.proto Type	| 说明 |	Go Type
|-|-|-|
| double ||	float64 |
| float || float32 |
| int32 |	使用变长编码，对于负值的效率很低，如果你的域有可能有负值，请使用sint64替代 |	int32
| uint32 |	使用变长编码	|uint32
| uint64 | 使用变长编码	| uint64
| sint32 |	使用变长编码，这些编码在负值时比 int32 高效的多	| int32
| sint64	| 使用变长编码，有符号的整型值。编码时比通常的 int64 高效。| 	int64
| fixed32 |	总是 4 个字节，如果数值总是比总是比 228 大的话，这个类型会比 uint32 高效。	| uint32
| fixed64 |	总是 8 个字节，如果数值总是比总是比 256 大的话，这个类型会比 uint64 高效。| 	uint64
| sfixed32 |	总是 4 个字节 |	int32
| sfixed64 |	总是 8 个字节 |	int64
| bool	|	| bool
| string	| 一个字符串必须是 UTF-8 编码或者 7-bit ASCII 编码的文本。	| string
| bytes |	可能包含任意顺序的字节数据。|	[]byte

```proto
message  Response{
  string name = 1;  // 1 是编号不是值
  int32  age = 2;
}
```
### 枚举类型
```proto
enum Gender{
  MALE = 0;
  FEMALE = 1;
}
message  Response{
  string name = 1;
  int32  age = 2;
  Gender g = 3;
}
```
go 中使用枚举类型
```go
... 
hello.Gender_FEMALE
```
### Map 类型
```proto
message  Response{
  string name = 1; // 姓名
  int32  age = 2; // 年龄
  map<string, string> map = 0;
}
```
这里不太建议使用 map， 因为无法直接看出 key 所表示的意思
### timestamp
proto 文件中需要从 `google/protobuf/timestamp.proto` 导入该类型
```proto
import "google/protobuf/timestamp.proto";

message  Response{
  google.protobuf.Timestamp date = 1; 
}
```
使用时需要导入拓展
```go
import (
  	"google.golang.org/protobuf/types/known/timestamppb" // [!code hl]
)
func (c *Server) SayHello(ctx context.Context, request *hello.HelloRequest) (*hello.Response, error) {
	return &hello.Response{
		Date: timestamppb.Now(), // [!code hl]
	}, nil
}
```
### protobuf 拓展
可以从 `google/protobuf/` 目录下导入相应的 protobuf 拓展，例如 timestamp 、empty 等
```proto
import "google/protobuf/timestamp.proto";
import "google/protobuf/empty.proto";
```
## 默认值
默认值
当一个消息被解析的时候，如果被编码的信息不包含一个特定的singular元素，被解析的对象锁对应的域被设置位一个默认值，对于不同类型指定如下：

* 对于 strings，默认是一个空 string
* 对于 bytes，默认是一个空的 bytes
* 对于 bools，默认是 false
*  对于数值类型，默认是 0
* 对于枚举，默认是第一个定义的枚举值，必须为 0
* 对于消息类型（ message ），域没有被设置，确切的消息是根据语言确定的，详见 [generated code guide](https://protobuf.dev/reference/)
* 对于可重复域的默认值是空（通常情况下是对应语言中空列表）

注：对于标量消息域，一旦消息被解析，就无法判断域释放被设置为默认值（例如，例如 boolean 值是否被设置为 false ）还是根本没有被设置。你应该在定义你的消息类型时非常注意。例如，比如你不应该定义 boolean 的默认值 false 作为任何行为的触发方式。也应该注意如果一个标量消息域被设置为标志位，这个值不应该被序列化传输。
查看 [generated code guide](https://protobuf.dev/reference/) 选择你的语言的默认值的工作细节。


## option go_package 的作用

通过 option go_package 可以指定编译生成后的文件和 package 名称

```proto
syntax = "proto3";

// ./v2 指定生成文件目录是 当前目录下的 v2 目录， package 名称为 hello
option go_package = "./v2;hello"; 

message StreamReqData{
  string  data = 1;
}
message StreamResData{
  string data = 1;
}
```

分号后面可以指定 package 的名称，如果不指定默认为生成文件目录的名称

例如下面代码生成的文件 package 名称就是 v2

```proto
syntax = "proto3";
option go_package = "./aa/v2"
```
## proto 文件导入 proto 文件
proto 文件中可以导入另一个 proto 文件
::: code-group
```proto  [hello.proto]
syntax = "proto3";
import "message.proto"; // 导入 message.proto 文件 // [!code ++]
option go_package = "./;hello";

service HelloResponse{
  rpc Ping(Empty) returns(Status);
}
message Empty{ // [!code --]
} // [!code --]
message Status{ // [!code --]
  int32 status = 1; // [!code --]
} // [!code --]
```
```proto [message.proto]
syntax = "proto3";
option go_package = "./;hello";

message Empty{
}
message Status{
  int32 status = 1;
}
```
:::

这里两个文件的 go_package 需要保持一致
## 嵌套 message 对象
当我们需要传递的数据格式比较复杂时，例如数组等，我们可以写成下面这样
```proto
syntax = "proto3";
option go_package = "./;hello";

message  Result{
  string name = 1;
  int32 age = 2;
} 
message HelloResult{
  repeated Result data = 1; // 返回一个数组
}
```
**注意**，当上面中的 Result 只使用一次时，推荐使用下面写法
```go
syntax = "proto3";
option go_package = "./;hello";

message  Users { // [!code --]
  string name = 1; // [!code --]
  int32 age = 2; // [!code --]
} // [!code --]

message HelloResult { 
  message  Users { // [!code ++]
    string name = 1; // [!code ++]
    int32 age = 2; // [!code ++]
  } // [!code ++]
  repeated Users data = 1;
}
```
使用时，可以通过 HelloResult_Users , 就是外部和内部通过 _ 拼接成的
```go
...
hello.HelloResult_Users{}
...
```
