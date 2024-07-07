### @nestjs/jwt
实现身份验证的功能
### @nestjs/passport的可选身份验证

### @nestjs/config 
registerAs以注册变
```
ConfigModule.forRoot({
          envFilePath:'.env', 
          //配置文件路径，也可以配置为数组如['/config/.env1','.env']。
          ignoreEnvFile:false, 
          //忽略配置文件，为true则仅读取操作系统环境变量，常用于生产环境
          isGlobal:true,       
          //配置为全局可见，否则需要在每个模块中单独导入ConfigModule
          load:[configuration,databaseconfig],
          //导入自定义配置文件，见下节
})
 ```
### passport-jwt
此模块允许您使用JSON Web令牌对端点进行身份验证ß