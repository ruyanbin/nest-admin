import { ApiProperty } from '@nestjs/swagger';

export class ImageCaptcha {
  @ApiProperty({ description: 'base64 格式的svg 图片' })
  img: string;
  @ApiProperty({ description: '验证码对应的唯一id' })
  id: string;
}

export class LoginToken {
  @ApiProperty({ description: 'JWT 身份token' })
  token: string;
}
