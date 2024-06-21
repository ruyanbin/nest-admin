### class-transformer
```映射普通的 js对象 指向您所拥有的 类的实例。```
 -------
### plainToClass
把一个普通的js对象转换成指定类的实例。
```
let users = plainToClass(User, userJson); 
```
-------
### plainToClassFromExist
这个方法会把一个普通的js对象转换成 一个已经被填充过的目标类的实例。
```
let users = plainToClass(User, userJson); 
```
-------
### classToPlain
这个方法把你的类对象还原成普通的js对象，在那之后就可以使用 JSON.stringify
``` 
import {classToPlain} from "class-transformer";
let photo = classToPlain(photo);
```
### Expose
空值实例中哪些字段存在