/**
 * 当接口不需要检测用户登录时
 * */
import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '~/modules/auth/auto.constant';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
