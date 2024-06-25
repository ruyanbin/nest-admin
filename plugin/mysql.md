### mysql 命令
mysql启动
```
net start mysql
net stop mysql
```
登录
```
mysql (-h) -u 用户名 -p 密码
注意，如果是连接到另外的机器上，则需要加入一个参数-h机器IP
```
创建和删除库
```angular2html
create database 库名；(character set  utf-s)
drop database 库名
```
显示数据库
```angular2html
show databases;
```
选择数据库
```angular2html
use 数据库名称
```
显示数据库中的数据表
```angular2html
use 库名
tables
```
显示数据表的结构
```angular2html
describe 表名
```
建表与删表
```angular2html
use 库名
create table 表名
drop table 表名
```
清空表中的记录
```angular2html
delete from 表名
```
显示表中的记录
```angular2html
SELECT * FROM 表明;
```
向表中添加记录
```angular2html
insert into 表名 values（字段列表）
```
更新表中数据
```angular2html
mysql>update 表名 set 字段="值" where 子句 order by 子句 limit 子句
WHERE 子句：可选项。用于限定表中要修改的行。若不指定，则修改表中所有的行。
ORDER BY 子句：可选项。用于限定表中的行被修改的次序。
LIMIT 子句：可选项。用于限定被修改的行数。
```
### 导入和导出数据
1 导出数据
```angular2html
mysqldump --opt test > mysql.test
即将数据库test数据库导出到mysql.test文本文件
例：mysqldump -u root -p用户密码 --databases dbname > mysql.dbname
```
2 导入数据
```  
mysqlimport -u root -p用户密码 < mysql.dbname。
```
3. 将文本数据导入数据库
```

```