import type { AxiosError } from "axios";

export type ApiErrorResponse = {
  message?: string;
};

export type ApiError = AxiosError<ApiErrorResponse>;

export function getErrorMessage(error: ApiError, fallback: string): string {
  return error.response?.data?.message || fallback;
}

export type SortConfig = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: SortConfig;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type PaginatedResponse<T> = {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: SortConfig;
  empty: boolean;
};
