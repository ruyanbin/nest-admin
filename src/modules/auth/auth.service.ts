/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(
    username: string,
    password: string,
    ip: string,
    ua: string,
  ): Promise<string> {
    return ' 1';
  }
}
