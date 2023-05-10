import {IPaginationParams} from "./IPaginationParams";

export interface PaginatedResponse<T>{
    values: T[],
    paginationParams: IPaginationParams
}
