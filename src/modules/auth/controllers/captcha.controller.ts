import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { ImageCaptcha } from '~/modules/auth/models/auth.model';
import { Public } from '~/modules/auth/decorators/public.decorator';
import { ImageCaptchaDto } from '~/modules/auth/dto/captcha.dto';
import * as svgCaptcha from 'svg-captcha';
import { generateUUID } from '~/utils';
import { isEmpty } from 'lodash';
import { generate } from 'rxjs';
import { genCaptchaImgKey } from '~/helper/getRedisKey';
@ApiTags('Captchas -验证码模块')
@Controller('auth/captcha')
export class CaptchaController {
  constructor(@InjectRedis() private redis: Redis) {}

  @Get('img')
  @ApiOperation({ summary: '获取登录图片验证码' })
  @ApiResult({ type: ImageCaptcha })
  @Public() // 不进行token 验证
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    const { width, height } = dto;
    console.log(height, 'height');
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(width) ? width : 100,
      height: isEmpty(height) ? height : 50,
      charPreset: '1234567890',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString('base64')}`,
      id: generateUUID(),
    };
    // 将验证码存到redis 中 5分钟过期时间
    await this.redis.set(genCaptchaImgKey(result.id), svg.text, 'EX', 60 * 5);
    return result;
  }
}
