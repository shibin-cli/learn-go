# 接口
## 鸭子类型
* “像鸭子走路，长得像鸭子” 那就是鸭子
* 描述事物的外部行为（方法），而非内部结构
* 严格说 go 属于解构话类型系统，类似 duck typing

## 接口

接口的定义
```go
type Duck interface {
	// 	这里面主要用来存放方法
	Gaga()
	Swim()
}
```
接口的实现
```go
type ToyDuck struct {
}

func (td *ToyDuck) Gaga() {
	fmt.Println("嘎嘎...")
}
func (td *ToyDuck) Swim() {
	fmt.Println("游泳..")
}
func main() {
	var duck Duck = &ToyDuck{}
	duck.Gaga()
	duck.Swim()
}
```