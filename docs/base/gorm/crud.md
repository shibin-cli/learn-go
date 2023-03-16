# CRUD
## 创建
### 创建记录
```go
user := User{Name: "Shibibn", Age: 18, Birthday: time.Now()}

result := db.Create(&user) // 通过数据的指针来创建

user.ID             // 返回插入数据的主键
result.Error        // 返回 error
result.RowsAffected // 返回插入记录的条数
```
### 批量插入
将 slice 传递给 Create 方法
```go
var users = []User{{Name: "a1"}, {Name: "a2"}, {Name: "a3"}}
db.Create(&users)
```
使用 `CreateInBatches` 分批创建时，你可以指定每批的数量
```go
db.CreateInBatches(users, 100)
```
当插入的数据过多时，就要使用分批创建
::: tip 为什么要使用分批创建
由于 mysql 对语句有长度限制，当插入的数据很多时，就会导致 sql 语句长度过长而报错。
:::
## 查询
### 检索单个对象

#### First、Take、Last
GORM 提供了 First、Take、Last 方法，以便从数据库中检索单个对象。
* First 主键升序
* Take 没有指定排序字段
* Last 主键降序
```go
// 获取第一条记录（主键升序）
db.First(&user)
// SELECT * FROM users ORDER BY id LIMIT 1;

// 获取一条记录，没有指定排序字段
db.Take(&user)
// SELECT * FROM users LIMIT 1;

// 获取最后一条记录（主键降序）
db.Last(&user)
// SELECT * FROM users ORDER BY id DESC LIMIT 1;
```
当查询数据库时它添加了 `LIMIT 1` 条件，且没有找到记录时，它会返回 `ErrRecordNotFound` 错误
```go
result := db.First(&user)
result.RowsAffected // 返回找到的记录数
result.Error        // returns error or nil

// 检查 ErrRecordNotFound 错误
errors.Is(result.Error, gorm.ErrRecordNotFound)
```
#### 根据主键检索

```go
db.First(&user, 10)
// SELECT * FROM users WHERE id = 10;

db.First(&user, "10")
// SELECT * FROM users WHERE id = 10;

db.Find(&users, []int{1,2,3})
// SELECT * FROM users WHERE id IN (1,2,3);
```
主键是个字符串，例如 uuid
```go
db.First(&user, "id = ?", "1b74413f-f3b8-409f-ac47-e8c062e3472a")
// SELECT * FROM users WHERE id = "1b74413f-f3b8-409f-ac47-e8c062e3472a";
```
### 检索全部对象
```go
// Get all records
result := db.Find(&users)
// SELECT * FROM users;

result.RowsAffected // returns found records count, equals `len(users)`
result.Error        // returns error
```
