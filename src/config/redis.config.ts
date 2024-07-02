import {RedisModule} from "@nestjs-modules/ioredis";
import {ConfigService} from "@nestjs/config"
export function redisConfig(){
    const config = ConfigService.config('redis')
    return RedisModule.forRoot({
        url: "",
        type: "single",
    })
}