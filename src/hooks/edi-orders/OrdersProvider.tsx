import {type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {OrdersContext, type OrdersState} from "@/hooks/edi-orders/OrdersContext.tsx";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {selectFilteredOrdersCount, selectOrdersSort, setOrdersSort} from "@/ducks/orders/ordersSlice.ts";
import type {EDIOrder, SortProps} from "chums-types";
import {LocalStore} from "@chumsinc/ui-utils";
import {STORAGE_KEYS} from "../../storage-keys.ts";

export interface PaginationProviderProps {
    children: ReactNode,
}

export default function OrdersProvider({children}: PaginationProviderProps) {
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(LocalStore.getItem<number>(STORAGE_KEYS.ROWS_PER_PAGE, 25) ?? 25);
    const sort = useAppSelector(selectOrdersSort);
    const count = useAppSelector(selectFilteredOrdersCount);

    useEffect(() => {
        Promise.resolve().then(() => {
            setPage(0);
        })
    }, [count, setPage]);

    const sortChangeHandler = useCallback((sort: SortProps<EDIOrder>) => {
        dispatch(setOrdersSort(sort));
    }, [dispatch]);

    const rowsPerPageHandler = useCallback((rowsPerPage: number) => {
        LocalStore.setItem<number>(STORAGE_KEYS.ROWS_PER_PAGE, rowsPerPage);
        setRowsPerPage(rowsPerPage);
        setPage(0);
    }, [setRowsPerPage, setPage])

    const value = useMemo<OrdersState>(() => ({
        count,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage: rowsPerPageHandler,
        sort,
        setSort: sortChangeHandler,
    }), [count, page, setPage, rowsPerPage, rowsPerPageHandler, sort, sortChangeHandler]);

    return (
        <OrdersContext value={value}>{children}</OrdersContext>
    )
}
