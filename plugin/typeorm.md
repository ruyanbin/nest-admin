### column

```
unique :：是否唯一，默认为 False。
nullable :：是否可为空，默认为 True。
name ：字段的名称，默认为类属性的名称。
type :：字段的数据类型，如 Integer、String、Date 等。
primary_key:是否为主键，默认为 False
default:：默认值，当插入数据时没有提供该字段的值时使用。
index: ：是否创建索引，默认为 False。
autoincrement:：是否为自增字段，仅适用于整数类型，默认为 False。
```

### QueryBuilder

他是 TypeORM 最强大的功能之一 ，它允许你使用优雅便捷的语法构建 SQL 查询，执行并获得自动转换的实体。
例子

```
const firstUser = await connection
.getRepository(User)
.createQueryBuilder("user")
.where("user.id = :id", { id: 1 })
.getOne();
```
生成mysql 语句
```angular2html
SELECT
    user.id as userId,
    user.firstName as userFirstName,
    user.lastName as userLastName
FROM users user
WHERE user.id = 1
```
然后返回一个 User 实例:
```angular2html
User {
    id: 1,
    firstName: "Timber",
    lastName: "Saw"
}

```
