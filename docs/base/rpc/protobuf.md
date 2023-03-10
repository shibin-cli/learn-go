# protobuf
protobuf 官网文档 https://protobuf.dev/programming-guides/proto3/

## 数据类型
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