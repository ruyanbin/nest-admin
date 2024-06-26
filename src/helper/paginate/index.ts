import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Pagination } from '~/helper/paginate/pagination';
import {
  IPaginationOptions,
  PaginationTypeEnum,
} from '~/helper/paginate/interface';
import { UserEntity } from '~/modules/sys/user/user.entity';
import { createPaginationObject } from '~/helper/paginate/create-pagination';
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

function resolveOptions(
  options: IPaginationOptions,
): [number, number, PaginationTypeEnum] {
  const { page, pageSize, paginationType } = options;

  return [
    page || DEFAULT_PAGE,
    pageSize || DEFAULT_LIMIT,
    paginationType || PaginationTypeEnum.TAKE_AND_SKIP,
  ];
}
async function paginateQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> {
  const [page, limit, paginationType] = resolveOptions(options);

  if (paginationType === PaginationTypeEnum.TAKE_AND_SKIP)
    queryBuilder.take(limit).skip((page - 1) * limit);
  else queryBuilder.limit(limit).offset((page - 1) * limit);

  const [items, total] = await queryBuilder.getManyAndCount();

  return createPaginationObject<T>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
  });
}
async function paginateRepository<T>(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T>> {
  const [page, limit] = resolveOptions(options);

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    repository.find({
      skip: limit * (page - 1),
      take: limit,
      ...searchOptions,
    }),
    undefined,
  ];

  const [items, total] = await Promise.all(promises);

  return createPaginationObject<T>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
  });
}
export async function paginate<T extends ObjectLiteral>(
  repository: SelectQueryBuilder<UserEntity>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T>>;
export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>>;
export async function paginate<T extends ObjectLiteral>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
) {
  return repositoryOrQueryBuilder instanceof Repository
    ? paginateRepository<T>(repositoryOrQueryBuilder, options, searchOptions)
    : paginateQueryBuilder<T>(repositoryOrQueryBuilder, options);
}
