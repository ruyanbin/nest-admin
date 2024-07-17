### class-validator
```
常见的验证装饰器	
@IsDefined(value: any)	检查值是否已定义（！==未定义，！==空）。这是唯一一个忽略skipMissingProperties选项的装饰器。
@IsOptional()	检查给定值是否为空（===空，===未定义），如果是，则忽略属性上的所有验证器。
@Equals(comparison: any)	检查值是否等于（“===”）比较。
@NotEquals(comparison: any)	检查值是否不相等（“！=="）比较。
@IsEmpty()	检查给定值是否为空（=== ''，=== null，===未定义）。
@IsNotEmpty()	检查给定值是否为空（！== '', !== null，！==未定义）。
@IsIn(values: any[])	检查值是否在允许的值数组中。
@IsNotIn(values: any[])	检查值是否不在不允许的值数组中。
```

```
类型验证装饰器	
@IsBoolean()	检查一个值是否为布尔值。
@IsDate()	检查值是否为日期。
@IsString()	检查该值是否为字符串。
@IsNumber(options: IsNumberOptions)	检查值是否是一个数字。
@IsInt()	检查该值是否为整数。
@IsArray()	检查该值是否为数组
@IsEnum(entity: object)	检查该值是否为有效枚举
```
```
数字验证装饰器	
@IsDivisibleBy(num: number)	检查该值是否是一个可以被另一个值整除的数字。
@IsPositive()	检查该值是否是大于零的正数。
@IsNegative()	检查该值是否为小于零的负数。
@Min(min: number)	检查给定的数字是否大于或等于给定数字。
@Max(max: number)	检查给定数字是否小于或等于给定数字。
```
```
日期验证装饰器	
@MinDate(date: Date | (() => Date))	检查该值是否是指定日期之后的日期。
@MaxDate(date: Date | (() => Date))	检查该值是否是指定日期之前的日期。
```
```
字符串类型验证装饰器	
@IsBooleanString()	检查字符串是否为布尔值（例如“真”或“假”或“1”、“0”）。
@IsDateString()	@IsISO8601()的别名。
@IsNumberString(options?: IsNumericOptions)	检查字符串是否是一个数字。
```
```angular2html
@IsOptional(): 这个装饰器表示该属性是可选的，即验证时不会强制要求该属性存在。
@IsDate(): 这个装饰器确保属性值是一个有效的日期。
@IsEmail(): 这个装饰器确保属性值是一个有效的电子邮件地址。
@IsString(): 这个装饰器确保属性值是一个字符串。
@IsIn(['male', 'female']): 这个装饰器确保属性值是 'male' 或 'female' 中的一个。
@IsPhoneNumber() 是一个装饰器，通常用于验证对象属性是否符合电话号码的格式
@IsNotEmpty() 是一个装饰器，通常用于验证对象属性是否不为空。
@IsNumberString() 是一个装饰器，通常用于验证对象属性是否为数字字符串
```
```
字符串验证装饰器	
@Contains(seed: string)	检查字符串是否包含种子。
@NotContains(seed: string)	检查字符串是否包含种子。
@IsAlpha()	检查字符串是否仅包含字母（a-zA-Z）。
@IsAlphanumeric()	检查字符串是否仅包含字母和数字。

```
```
其他装饰器	
@Allow()	当没有为属性指定其他约束时，防止剥离该属性。
```
```
ValidationOptions的配置项
each?: boolean;//验证项是否为数组
message?: string | ((validationArguments: ValidationArguments) => string);//报错信息
groups?: string[];//用于此验证的验证组。
always?: boolean;//是否始终必须始终执行验证
context?: any;
```
```
校验message中可获得的变量
$value - 正在验证的值
$property - 要验证的对象属性的名称
$target - 要验证的对象的类的名称
$constraint1, $constraint2, ... $constraintN - 由特定验证类型定义的约束
```