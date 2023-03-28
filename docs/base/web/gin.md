# Gin

[Gin](https://gin-gonic.com) 是一个用 Go (Golang) 编写的 HTTP Web 框架。 它具有类似 Martini 的 API，但性能比 Martini 快 40 倍。如果你需要极好的性能，使用 Gin 吧。

Gin 文档地址 https://gin-gonic.com/zh-cn/docs/

## 安装

```bash
go get -u github.com/gin-gonic/gin
```
## 快速入门
```go
package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // 监听并在 0.0.0.0:8080 上启动服务
}
```

## 路由
### 设置路由
```go
r := gin.Default()
r.GET("/user", func(c *gin.Context) {
  c.JSON(200, gin.H{
    "message": "pong",
  })
})
r.GET("/goods", func(c *gin.Context) {
  ...
})
r.POST("/goods", func(c *gin.Context) {
  ...
})
```
### 路由分组
```go
r := gin.Default()
goodsGroup := r.Group("/goods")
{
  goodsGroup.GET("/", goodsList)
  goodsGroup.GET("/1", goodsDetail)
  goodsGroup.POST("/add", createGoods)
}

userGroup := r.Group("/user")
{
  userGroup.GET("/", userList)
  userGroup.GET("/1", userDetail)
  userGroup.POST("/add", createUser)
}
```
### 获取 url 参数
```go
r.GET("/user/:name", func(c *gin.Context) {
  name := c.Param("name")

  c.JSON(http.StatusOK, gin.H{
		"name": name,
	})
})
```
多个参数
```go
r.GET("/user/:name/:action", func(c *gin.Context) {
  name := c.Param("name")
  action := c.Param("action")

  c.JSON(http.StatusOK, gin.H{
    "name":   name,
    "action": action,
  })
})
```
## get 参数
```go
r.GET("/user", func(c *gin.Context) {
  c.JSON(http.StatusOK, gin.H{
    "page":     c.Query("page"), 
    "pagesize": c.DefaultQuery("pagesize", "10"), // 获取 query， 默认值为10
  })
})
```
## post 参数
### form 参数
```go
func createUUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"name": c.PostForm("name"), // 获取 form 参数
		"age":  c.PostForm("age"),
		"city": c.DefaultPostForm("city", "北京"), // 获取 form参数，默认值是 北京
	})
}
```
### raw 参数
推荐使用[表单验证](#表单验证)
```go
func createGoods(c *gin.Context) {
	data, _ := c.GetRawData()
	var body map[string]string
	_ = json.Unmarshal(data, &body)

	c.JSON(http.StatusOK, gin.H{
		"body": body,
	})
}
```
## protobuf
返回 protobuf
```go
r.GET("/protobuf", func(c *gin.Context) {
  user := &user.User{
    Name: "shibin",
    Age:  17,
    City: "Beijing",
  }
  c.ProtoBuf(http.StatusOK, user)
})
```
解析 profobuf
```go
resp, _ := http.Get("http://localhost:8080/protobuf")
bytes, _ := io.ReadAll(resp.Body)
var res user.User
_ := proto.Unmarshal(bytes, &res)
```
## 参数验证
要将请求体绑定到结构体中，使用模型绑定。

Gin 使用 [go-playground/validator](https://pkg.go.dev/github.com/go-playground/validator/v10) 验证参数

使用时，需要在要绑定的所有字段上，设置相应的 `tag` 。 例如，使用 `JSON` 绑定时，设置字段标签为 `json:"fieldname"`

```go
// 此处 json 表示 content-type 为 application/json
type User struct {
  Username string `json:"username"`
  Password string `json:"password"`
}
```
* 如果是 `GET` 请求，只使用 `Form` 绑定引擎（`query`）。
* 如果是 `POST` 请求，首先检查 `content-type` 是否为 `JSON` 或 `XML`，然后再使用 `Form`（`form-data`）。

可以指定必须绑定的字段。如果一个字段的 `tag` 加上了 `binding:"required"` ，但绑定时是空值, Gin 会报错。

```go
type User struct {
  username string `json:"username" binding:"required"`
  Password string `json:"password" binding:"required"`
}
```

Gin提供了两类绑定方法：

* Must bind
  * `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
* Should bind
  * `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`


### body 参数验证

```go
r.POST("/login", func(c *gin.Context) {
  var user User
  err := c.ShouldBind(&user)
  if err != nil {
    fmt.Println(err)
    c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
    return
  }
  c.JSON(http.StatusOK, gin.H{
    "user": user,
  })
})
```
实现注册认证
```go
type Signup struct {
	Username   string `json:"username" binding:"required,min=3,max=30"`
	Password   string `json:"password" binding:"required,min=6,max=50"`
	RePassword string `json:"re_password" binding:"required,eqfield=Password"`
	Tel        string `json:"tel" binding:"required,len=11"`
	Email      string `json:"email" binding:"required,email"`
}
```
```go
func signup(c *gin.Context) {
	var signupUser Signup
	err := c.ShouldBind(&signupUser)
	fmt.Println(signupUser)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user": signupUser,
	})
}
```
### url 参数验证
```go
r.GET("/user/:id/:action", func(c *gin.Context) {
  var params struct {
    Id     string `uri:"id" binding:"required"`
    Action string `uri:"action" binding:"required"`
  }

  err := c.ShouldBindUri(&params)
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
  }
  c.JSON(http.StatusOK, gin.H{
    "params": params,
  })
})
```
### query 参数验证
```go
r.GET("/list", func(c *gin.Context) {
  var query struct {
    Page     string `form:"page"`
    Pagesize string `form:"pagesize"`
  }

  err := c.ShouldBindQuery(&query)
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
  }
  c.JSON(http.StatusOK, gin.H{
    "params": query,
  })
})
```

更多参考 
* [gin 模型绑定验证](https://gin-gonic.com/zh-cn/docs/examples/binding-and-validation/)
* [go-playground/validator](https://pkg.go.dev/github.com/go-playground/validator/v10)
  * https://github.com/go-playground/validator/


## 验证信息翻译
参考  [go-playground/validator/_examples/translations/main.go](https://github.com/go-playground/validator/blob/master/_examples/translations/main.go)

初始化翻译
```go
var trans ut.Translator
func initTrans(local string) (err error) {
  // 修改 gin validator 引擎属性
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		zhT := zh.New()
		enT := en.New()
		// 第一个参数是备用语言,后面参数是需要支持的环境
		uni := ut.New(enT, zhT, enT)
		trans, ok = uni.GetTranslator(local)
		if !ok {
			return fmt.Errorf("uni.GetTranslator(%s)", local)
		}
		switch local {
		case "en":
			return en_translations.RegisterDefaultTranslations(v, trans)
		case "zh":
			return cn_translations.RegisterDefaultTranslations(v, trans)
		default:
			return en_translations.RegisterDefaultTranslations(v, trans)
		}
	}
	return fmt.Errorf("uni.GetTranslator(%s)", local)
}
```
在请求中使用
```go
func signup(c *gin.Context) {
	var signupUser Signup

	if err := c.ShouldBind(&signupUser); err != nil {
		errs, ok := err.(validator.ValidationErrors) // [!code ++]
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"err": err.Error(),
			})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{ // [!code ++]
				"err": errs.Translate(trans), // [!code ++]
			}) // [!code ++]
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user": signupUser,
	})
}

```
## gin 中间键

```go
func main() {
  r := gin.New()
  // 全局中间件
  r.Use(func(c *gin.Context) {
		...
	})

	// group 中间键
	{
		goodsRoute := r.Group("/goods")
		goodsRoute.Use(func(c *gin.Context) {
			...
		})
		goodsRoute.Use(func(c *gin.Context) {
			...
		})
	}
  r.run(":8080")
}
```
将中间件封装到函数中
```go
func myLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()
		c.Next()
		fmt.Println(time.Since(t), c.FullPath(), c.Writer.Status())
	}
}

func main() {
  r := gin.New()
  r.Use(myLogger())
  r.run(":8080")
}
```
如果要阻止后续中间键的执行，可以使用 `context.Abort`
```go
func authRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		var token string
		for k, v := range c.Request.Header {
			if k == "X-Token" {
				token = v[0]
				break
			}
		}
		if token != "shibin" {
			c.JSON(http.StatusUnauthorized, gin.H{"msg": "token不合法"})

			// return 无法阻止后面中间键的执行  // [!code ++]
			c.Abort() // [!code ++]
		}
		c.Next()
	}
}
```
