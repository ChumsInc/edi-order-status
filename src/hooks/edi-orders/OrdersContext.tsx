import type {EDIOrder, SortProps} from "chums-types";
import {createContext} from "react";

export interface OrdersState {
    count: number;
    page: number;
    rowsPerPage: number;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
    sort: SortProps<EDIOrder>;
    setSort: (sort: SortProps<EDIOrder>) => void;
    completed: boolean;
    setCompleted: (completed: boolean) => void;
    minDate: string;
    maxDate: string;
    setMinDate: (minDate: string) => void;
    setMaxDate: (maxDate: string) => void;
}

export const OrdersContext = createContext<OrdersState | null>(null);
