# GORM

[GORM](https://gorm.io/) 文档地址 https://gorm.io/zh_CN/docs/

## 安装

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/mysql
```

## 连接数据库

```go
import (
  "gorm.io/driver/mysql"
  "gorm.io/gorm"
)

func main() {
  // 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情
  dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
  db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
}
```
下面是 dsn 的格式，具体详情可以参考[这里](https://github.com/go-sql-driver/mysql#dsn-data-source-name)
```
[username[:password]@][protocol[(address)]]/dbname[?param1=value1&...&paramN=valueN]
```

## 快速入门

```go
package main

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name string
	Age  uint8
}

func main() {
	dsn := "user:pass@tcp(127.0.0.1:3306)/test?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	// 迁移 schema ,自动创建表
	_ = db.AutoMigrate(&User{})
	db.Create(&User{Name: "Shibin", Age: 18}) // 插入一条数据

	var user User
	db.First(&user, 1)               // 根据整型主键查找
	db.First(&user, "age = ?", "18") // 查找 age 字段值为 18 的记录
  
	// 更新多个字段
	db.Model(&user).Updates(User{Name: "aaa", Age: 10}) // 仅更新非零值字段
	db.Model(&user).Updates(map[string]interface{}{"Name": "Shibin", "Age": 17})
	
	// 删除  逻辑删除
	db.Delete(&user, 8)
}
```

## 更新非零值字段
```go
type User struct {
	gorm.Model
	Name sql.NullString // 修改 string 为 sql.NullString
}
...
	// sql.NullString 结构体的 Valid 设置为 true ,就可以将字段设置为零值
	db.Model(&user).Updates(User{Name: sql.NullString{String: "", Valid: true}})
...
```
除了字符串的 sql.NullString 还有 sql.NullInt32 等，方法都和上面的类型

也可以使用指针的形式
```go
type User struct {
	gorm.Model
	Name *string // 修改 string 为 sql.NullString
}
...
	empty := ""
	db.Model(&user).Updates(User{Name: &empty})
...
```
## Logger

[Logger](https://gorm.io/zh_CN/docs/logger.html)

```go
newLogger := logger.New(
  log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer（日志输出的目标，前缀和日志包含的内容——译者注）
  logger.Config{
    SlowThreshold: time.Second,   // 慢 SQL 阈值
    LogLevel:      logger.Info, // 日志级别
    IgnoreRecordNotFoundError: true,   // 忽略ErrRecordNotFound（记录未找到）错误
    Colorful:      true,         // 彩色打印
  },
)

// 全局模式
db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
  Logger: newLogger,
})

// 新建会话模式
tx := db.Session(&Session{Logger: newLogger})
tx.First(&user)
tx.Model(&user).Update("Age", 18)
```

### 日志级别

GORM 定义了这些日志级别：`Silent`、`Error`、`Warn`、`Info`

### Debug

Debug 单个操作，将当前操作的 log 级别调整为 logger.Info

```go
db.Debug().Where("name = ?", "shibin").First(&User{})
```