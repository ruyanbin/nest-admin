/**
 * 当接口不需要检测用户登录时
 * */
import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '~/modules/auth/auto.constant';
/**
 * 当接口不需要检测用户登录时添加该装饰器
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
