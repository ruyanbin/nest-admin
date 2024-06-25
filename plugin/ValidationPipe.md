### 管道后可以设置如下配置参数

enableDebugMessages	boolean	如果设置为 true，当出现问题时，验证器将向控制台打印额外的警告消息

skipUndefinedProperties	boolean	如果设置为 true，则验证器将跳过验证对象中未定义的所有属性的验证

skipNullProperties	boolean	如果设置为 true，则验证器将跳过验证对象中所有为 null 的属性的验证

skipMissingProperties	boolean	如果设置为 true，则验证器将跳过验证对象中所有为 null 或未定义的属性的验证

whitelist	boolean	如果设置为 true，验证器将删除已验证（返回）对象的任何不使用任何验证装饰器的属性

forbidNonWhitelisted	boolean	如果设置为 true，验证器将抛出异常，而不是剥离非白名单属性

forbidUnknownValues	boolean	如果设置为 true，尝试验证未知对象会立即失败

disableErrorMessages	boolean	如果设置为 true，验证错误将不会返回给客户端

errorHttpStatusCode	number	此设置允许您指定在发生错误时将使用哪种异常类型。默认情况下它会抛出 BadRequestException

exceptionFactory	Function	获取验证错误数组并返回要抛出的异常对象

groups	string[]	验证对象期间要使用的组

always	boolean	设置 always 装饰器选项的默认值。可以在装饰器选项中覆盖默认值

strictGroups	boolean	如果 groups 未给出或为空，则忽略至少一组的装饰器

dismissDefaultMessages	boolean	如果设置为 true，验证将不会使用默认消息。undefined 如果没有明确设置，错误消息总是会出现

validationError.target	boolean	指示目标是否应暴露在 ValidationError

validationError.value	boolean	指示是否应在 中公开经过验证的值 ValidationError

stopAtFirstError	boolean	当设置为 true 时，给定属性的验证将在遇到第一个错误后停止。默认为 false

[官网](https://nestjs.inode.club/techniques/validation#%E4%BD%BF%E7%94%A8%E5%86%85%E7%BD%AE%E7%9A%84validationpipe)
