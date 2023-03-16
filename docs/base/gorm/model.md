# 模型
文档地址  https://gorm.io/zh_CN/docs/models.html
## 模型定义
模型是标准的 struct，由 Go 的基本数据类型、实现了 [Scanner](https://pkg.go.dev/database/sql#Scanner) 和 [Valuer](https://pkg.go.dev/database/sql/driver#Valuer) 接口的自定义类型及其指针或别名组成

```go
type User struct {
  ID           uint
  Name         string
  Email        *string
  Age          uint8
  Birthday     *time.Time
  MemberNumber sql.NullString
  ActivatedAt  sql.NullTime
  CreatedAt    time.Time
  UpdatedAt    time.Time
}
```
## 约定
GORM 倾向于约定优于配置 默认情况下，GORM 使用 ID 作为主键，使用结构体名的`蛇形复数`作为表名，字段名的`蛇形`作为列名，并使用 `CreatedAt`、`UpdatedAt` 字段追踪创建、更新时间

如果您遵循 GORM 的约定，您就可以少写的配置、代码。 如果约定不符合您的实际要求，GORM 允许你配置它们
```go
// gorm.Model 的定义
type Model struct {
  ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
}
```
您可以将它嵌入到您的结构体中，以包含这几个字段
```go
type User struct {
  gorm.Model
  Name string
}
// 等效于
type User struct {
  ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
  Name string
}
```
## 字段标签
声明 model 时，tag 是可选的

```GO
type User struct {
	UserId uint   `gorm:"primaryKey;"`
	Name   string `gorm:"type:varchar(50);unique;comment:姓名"`
	Age    uint8  `gorm:"comment:年龄"`
}
```
GORM 支持以下 tag： tag 名大小写不敏感，但建议使用 `camelCase` 风格

| 标签名	| 说明 |
| -| - |
| column |	指定 db 列名
| type |	列数据类型，推荐使用兼容性好的通用类型，例如：所有数据库都支持 bool、int、uint、float、string、time、bytes 并且可以和其他标签一起使用，例如：not null、size, autoIncrement… 像 varbinary(8) 这样指定数据库数据类型也是支持的。在使用指定数据库数据类型时，它需要是完整的数据库数据类型，如：MEDIUMINT UNSIGNED not NULL AUTO_INCREMENT |
| serializer |	指定将数据序列化或反序列化到数据库中的序列化器, 例如: serializer:json/gob/unixtime |
| size |	定义列数据类型的大小或长度，例如 size: 256 |
|primaryKey|	将列定义为主键 |
|unique	| 将列定义为唯一键 |
|default|	定义列的默认值 |
|precision|	指定列的精度 |
|scale	| 指定列大小 |
|not null|	指定列为 NOT NULL |
|autoIncrement|	指定列为自动增长 |
|autoIncrementIncrement |	自动步长，控制连续记录之间的间隔 |
|embedded |	嵌套字段 |
|embeddedPrefix|	嵌入字段的列名前缀 |
|autoCreateTime	| 创建时追踪当前时间，对于 int 字段，它会追踪时间戳秒数，您可以使用 nano/milli 来追踪纳秒、毫秒时间戳，例如：autoCreateTime:nano |
|autoUpdateTime	|创建/更新时追踪当前时间，对于 int 字段，它会追踪时间戳秒数，您可以使用 nano/milli 来追踪纳秒、毫秒时间戳，例如：autoUpdateTime:milli |
| index	|根据参数创建索引，多个字段使用相同的名称则创建复合索引，查看[索引](https://gorm.io/zh_CN/docs/indexes.html)获取详情
| uniqueIndex	|与 index 相同，但创建的是唯一索引 |
| check	|创建检查约束，例如 check:age > 13，查看[约束](https://gorm.io/zh_CN/docs/constraints.html)获取详情 |
| <-	|设置字段写入的权限， <-:create 只创建、<-:update 只更新、<-:false 无写入权限、<- 创建和更新权限 |
| ->	| 设置字段读的权限，->:false 无读权限 |
| - |	忽略该字段，- 表示无读写，-:migration 表示无迁移权限，-:all 表示无读写迁移权限 |
| comment |	迁移时为字段添加注释 |
