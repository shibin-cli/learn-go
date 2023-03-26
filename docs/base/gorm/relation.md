# 关联
## Belongs To
`belongs to` 会与另一个模型建立了一对一的连接。 这种模型的每一个实例都“属于”另一个模型的一个实例。

```go
type User struct {
	gorm.Model
	Name string
	Age  uint8
}

// Article 属于 User， UserID 时外键 
type Article struct {
	Title   string
	Content string
	User    User
	UserID  int
}


...

_ = db.AutoMigrate(&Article{})
//	 CREATE TABLE `articles` (`title` longtext,`content` longtext,`user_id` bigint unsigned,CONSTRAINT `fk_articles_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`))
```

创建一条记录
```go
db.Create(&Article{Title: "aaaa", UserID: 1})
//  INSERT INTO `articles` (`title`,`content`,`user_id`) VALUES ('aaaa','',1)
```

重写外键
```go
type User struct {
  gorm.Model
  Name         string
  CompanyRefer int
  Company      Company `gorm:"foreignKey:CompanyRefer"`
  // 使用 CompanyRefer 作为外键
}
```
## 关联创建


```go
type CreditCard struct {
  gorm.Model
  Number   string
  UserID   uint
}

type User struct {
  gorm.Model
  Name       string
  CreditCard CreditCard
}

db.Create(&User{
  Name: "shibin",
  CreditCard: CreditCard{Number: "411111111111"}
})
// INSERT INTO `users` ...
// INSERT INTO `credit_cards` ...
```
## 关联查询
### Preload
`Preload` 在一个单独查询中加载关联数据
```go
var article Article
db.Preload("User").First(&article)

// SELECT * FROM `users` WHERE `users`.`id` = 5
// SELECT * FROM `articles`  LIMIT 1
```
### Joins
`Join Preload` 会使用 left join 加载关联数据
```go
db.Joins("User").First(&article)
```
## Has Many
`has many` 与另一个模型建立了一对多的连接
```go
// User 有多张 CreditCard，UserID 是外键
type User struct {
  gorm.Model
  CreditCards []CreditCard
}

type CreditCard struct {
  gorm.Model
  Number string
  UserID uint
}
```

```go
var user User
db.Preload("CreditCards").First(&user)
for _, card := range user.CreditCards {
    fmt.Println(card.Number)
}
```
## Many To Many

```go
// User 拥有并属于多种 language，`user_languages` 是连接表
type User struct {
	gorm.Model
	Languages []Language `gorm:"many2many:user_languages;"`
}

type Language struct {
	gorm.Model
	Name string
}
```

当使用 `GORM` 的 `AutoMigrate` 为 `User` 创建表时， `GORM` 会自动创建连接表

```go
var user User
db.AutoMigrate(&user)
// 会自动创建 users 、languages 和 user_languages 三张表
```
### 反向引用
```go
// User 拥有并属于多种 language，`user_languages` 是连接表
type User struct {
  gorm.Model
  Languages []*Language `gorm:"many2many:user_languages;"`
}

type Language struct {
  gorm.Model
  Name string
  Users []*User `gorm:"many2many:user_languages;"`
}
```
### 查询
```go
// 检索 User 列表并预加载 Language
db.Preload("Languages").First(&user)
for _, language := range user.Languages {
    fmt.Println(language.Name)
}
```
上面使用预加载 Language， 会造成性能上的浪费，这时，我们可以使用[关联模式](https://gorm.io/zh_CN/docs/associations.html#%E6%9F%A5%E6%89%BE%E5%85%B3%E8%81%94)。

关联模式
```go
// `user` 是源模型，它的主键不能为空
// 关系的字段名是 `Languages`
var languages []Language
db.Model(&user).Association("Languages").Find(&languages)
fmt.Println(languages)
```