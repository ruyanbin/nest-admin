
## 实体装饰器
@Entity
```angular2html
    name: 表名
    engine: 数据库引擎
    database: 数据库
    synchronize: 是否同步更该表结构
    orderBy: 查询时的默认排序
```
### @ViewEntity()
视图实体，不会对应表
### @CreateDateColumn()，自动插入
### @UpdateDateColumn()，自动更新
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
## 关系装饰器
1. OneToOne()
拥有该列的是从表，拥有关系的一方 ，即拥有xxxId的一方必须和@JoinColumn()配合使用。
第一个参数是一个函数，返回关联的实体类，
第二个参数如果有，是指定关系的反方，即关联字段的那方的实体类可以通过它的xxx属性来查询关系，
第三个参数是配置关系的选项，包括 cascade级联，createForeignKeyConstraints创建外键,eager查询时总是把关系类也查出来。
其他的关系装饰器也大抵如此
2. ManyToOne()，拥有该列的表是从表，默认生成关联id，多对一的情况下，可以省略 @JointColumn(), 除非想指定 关联id 和关联列
3. OneToMany()，反向关系，用在一的一方
4. ManyToMany() 双方都必须使用，而且必须有一方使用@JoinTable()
5. JoinColumn()
   指定关系列字段，用于一对一，多对一和多对多，可以设置 cascade，createForeignKeyConstraints，以及另一面的关系属性。
6. JoinTable()
   用于多对多添加中间表，并指定拥有关系的列，只需要一方添加即可。一般要配合@ManyToMany()使用，还可以配置关联表名称和指定关联的列名和关联表的列名
7. RelationId()
   可以获取关联的实体的id，包括多对一和多对多，此 id 仅用于展示，对其修改并不会增删改关系


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
