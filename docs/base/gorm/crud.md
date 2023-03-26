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
## 更新
### 保存所有字段

`Save` 会保存所有的字段，即使字段是零值

```go
var user User
db.First(&user, 1)
user.Age = 100
db.Save(&user)
//  UPDATE `users` SET `created_at`='2023-03-24 23:58:41.772',`updated_at`='2023-03-26 00:11:49.73',`deleted_at`=NULL,`name`='shibin',`age`=100 WHERE `users`.`deleted_at` IS NULL AND `id` = 1
```
当保存的数据没有主键时，就会创建一条新数据
```go
var user User
user.ID = 0
user.Name = "To"
db.Save(&user)
//  INSERT INTO `users` (`created_at`,`updated_at`,`deleted_at`,`name`,`age`) VALUES ('2023-03-26 00:13:53.304','2023-03-26 00:13:53.304',NULL,'To',0)
```
### 更新单个字段
```go
// 条件更新
db.Model(&User{}).Where("age=", 100).Update("name", "Go")
//  UPDATE `users` SET `name`='Go',`updated_at`='2023-03-26 00:18:14.385' WHERE `age=` = 100 AND `users`.`deleted_at` IS NULL

// user id 是 1
db.Model(&user).Update("name", "Gin")
// UPDATE `users` SET `name`='Gin',`updated_at`='2023-03-26 00:20:29.598' WHERE `users`.`deleted_at` IS NULL AND `id` = 1
```
### 更新多个字段
```go
// 根据 struct 更新  只会更新非零值字段
db.Model(&user).Updates(User{Name: "hello", Age: 18, Active: false})
// UPDATE users SET name='hello', age=18, updated_at = '2013-11-17 21:34:10' WHERE id = 111;

// 根据 map 更新
db.Model(&user).Updates(map[string]interface{}{"name": "hello", "age": 18, "active": false})
// UPDATE users SET name='hello', age=18, active=false, updated_at='2013-11-17 21:34:10' WHERE id=111;
```
### 更新选定字段
如果想要在更新时，选定、忽略某些字段，可以使用 `Select` 、`Omit`
```go
// 根据 map 更新 零值字段也可以更新
db.Model(&user).Select("name").Updates(map[string]interface{}{"name": "hello", "age": 18, "active": false})
// UPDATE users SET name='hello' WHERE id=111;

db.Model(&user).Omit("name").Updates(map[string]interface{}{"name": "hello", "age": 18, "active": false})
// UPDATE users SET age=18, active=false, updated_at='2013-11-17 21:34:10' WHERE id=111;

// 根据 struct 更新，可以选定更新零值字段
db.Model(&user).Select("Name", "Age").Updates(User{Name: "new_name", Age: 0})
// UPDATE users SET name='new_name', age=0 WHERE id=111;

// 更新所有字段，包括零值字段
db.Model(&user).Select("*").Updates(User{Name: "jinzhu", Role: "admin", Age: 0})

// 更新除了 Role 的所有字段 包括零值字段
db.Model(&user).Select("*").Omit("Role").Updates(User{Name: "jinzhu", Role: "admin", Age: 0})
```

## 删除
### 删除一条记录
```go
// user  的 id 是 1
db.Delete(&user)
// DELETE from users where id = 1;

// 带额外条件的删除
db.Where("name = ?", "shibin").Delete(&user)
// DELETE from users where id = 1 AND name = "shibin";
```
:::warning 注意
删除一条记录时，删除对象需要指定主键，否则会触发[批量删除](#批量删除)
:::
### 根据主键删除
```go
db.Delete(&User{}, 10)
// DELETE FROM users WHERE id = 10;

db.Delete(&users, []int{1,2,3})
// DELETE FROM users WHERE id IN (1,2,3);
```

### 批量删除

如果指定的值不包括主键，那么会执行批量删除，它将删除所有匹配的记录

```go
db.Where("email LIKE ?", "%shibin%").Delete(&Email{})
// DELETE from emails where email LIKE "%shibin%";

db.Delete(&Email{}, "email LIKE ?", "%shibin%")
// DELETE from emails where email LIKE "%shibin%"
```
### 软删除
如果模型中包含了 `gorm.DeletedAt` 这个字段，它将会自动使用软删除。软删除时，记录并不会真正删除，但会将 `DeletedAt` 这个字段的时间设置为删除的时间，并且不能通过正常的查询方法查询到该记录

```go
db.Delete(&user)
// UPDATE users SET deleted_at="2013-10-29 10:23" WHERE id = 1;

// 批量删除
db.Where("age = ?", 20).Delete(&User{})
// UPDATE users SET deleted_at="2013-10-29 10:23" WHERE age = 20;

// 查询时会忽略被软删除的记录
db.Where("age = 20").Find(&user)
// SELECT * FROM users WHERE age = 20 AND deleted_at IS NULL;
```

可以使用 `Unscoped` 查询到被软删除的几率
```go
var users []User

db.Unscoped().Find(&users)
// SELECT * FROM `users`
```
### 永久删除
```go
db.Unscoped().Delete(&user)
// DELETE FROM users WHERE id=1;
```