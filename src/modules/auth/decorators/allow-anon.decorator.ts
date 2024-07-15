import { SetMetadata } from '@nestjs/common';
import { ALLOW_ANON_KEY } from '~/modules/auth/auto.constant';

export const AllowAnon =()=>SetMetadata(ALLOW_ANON_KEY,true)