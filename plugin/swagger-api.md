### ApiProperty
```angular2html
type 类型
required 是否必须
description 描述
default 默认值
name 属性名称，默认是装饰器修饰的属性名，但是显性的设置name文档中按照这个name的value为最终输入值

```
### ApiBody
TypeScript 不会存储有关泛型或接口的元数据.
需要使用ApiBody显性设置类型。
```angular2html
@ApiBody({ type: [CreateUserDto] })
createBulk(@Body() usersDto: CreateUserDto[])
```
### ApiPropertyOptional
ApiProperty默认是必填的，如果期望是选填的。
可以使用ApiPropertyOptional来代替。可以不需要去{required: false}了
ApiPropertyOptional其它参数参考ApiProperty.

### PartialType
对于create操作，所有的参数可能都是必填。
而对于update操作，只需要更新部分操作。
通过PartialType可以返回一个所有输入都是可选的参数
```angular2html
export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
```
### PickType
功能从一个输入类型中选择一部分属性来创建一个新类型（类）
```angular2html
class updateDTO extends PickType(PersonDTO,['name','hintText']){}
```
updateDTO只有name与hintText两个属性。

PickType显然很有用
### OmitType
OmitType与PickType功能是相反的，写法也一样。
移除指定的输入属性。

### IntersectionType
函数将两种类型组合成一个新类型.
```angular2html
export class UpdateCatDto extends IntersectionType(CreateCatDto, AdditionalCatInfo) {}
```
注意是将两种输入类变成一个输入类，把两个类的所有属性合并为一个类

1. PartialType是类的所有成员全部变成可选的。
2. PickType对指定输入类选择指定的成员并返回一个类。
3. OmitType对指定输入类排除指定的成员并返回一个类。
4. IntersectionType是合并两个输入类，合并所有成员。