import type {EDIOrder, SortProps} from "chums-types";
import {createContext, type RefObject} from "react";

export interface OrdersState {
    count: number;
    page: number;
    rowsPerPage: number;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
    sort: SortProps<EDIOrder>;
    setSort: (sort: SortProps<EDIOrder>) => void;
}

export const OrdersContext = createContext<OrdersState | null>(null);
