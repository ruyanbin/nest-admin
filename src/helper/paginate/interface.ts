import { ObjectLiteral } from 'typeorm';

export interface IPaginationMeta extends ObjectLiteral {
  itemCount: number;
  totalItems?: number;
  itemsPerPage: number;
  totalPages?: number;
  currentPage: number;
}
