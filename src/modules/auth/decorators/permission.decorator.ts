import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '~/modules/auth/auto.constant';
// import { isPlainObject } from '@nestjs/common/utils/shared.utils';
// type TupleToObject<T extends string, P extends ReadonlyArray<string>> = {
//   [K in Uppercase<P[number]>]: `${T}:${Lowercase<K>}`;
// };
// type AddPrefixToObjectValue<
//   T extends string,
//   P extends Record<string, string>,
// > = {
//   [K in keyof P]: K extends string ? `${T}:${P[K]}` : never;
// };

/**
 * */
export function Perm(permission: string | string[]) {
  return applyDecorators(SetMetadata(PERMISSION_KEY, permission));
}