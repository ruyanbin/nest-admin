import { Injectable } from '@nestjs/common';

@Injectable()
export class CaptchaService {
  constructor() {}

  /**
   * 校验图片验证码
   * **/

  async chckeImgCaotcha(id: string, code: string): Promise<void> {}
}
