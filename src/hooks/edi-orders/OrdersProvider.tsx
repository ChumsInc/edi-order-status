import {type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {OrdersContext, type OrdersState} from "@/hooks/edi-orders/OrdersContext.tsx";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {selectFilteredOrdersCount, selectOrdersSort, setOrdersSort} from "@/ducks/orders/ordersSlice.ts";
import type {EDIOrder, SortProps} from "chums-types";
import {LocalStore} from "@chumsinc/ui-utils";
import {STORAGE_KEYS} from "../../storage-keys.ts";
import {selectCurrentCustomer} from "@/ducks/customers/customersSlice.ts";

export interface PaginationProviderProps {
    children: ReactNode,
}

export default function OrdersProvider({children}: PaginationProviderProps) {
    const dispatch = useAppDispatch();
    const formRef = useRef<HTMLFormElement|null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(LocalStore.getItem<number>(STORAGE_KEYS.ROWS_PER_PAGE, 25) ?? 25);
    const [completed, setCompleted] = useState(false);
    const [minDate, setMinDate] = useState<string>('');
    const [maxDate, setMaxDate] = useState<string>('');
    const currentCustomer = useAppSelector(selectCurrentCustomer);
    const sort = useAppSelector(selectOrdersSort);
    const count = useAppSelector(selectFilteredOrdersCount);

    useEffect(() => {
        Promise.resolve().then(() => {
            setPage(0);
        })
    }, [count, setPage]);

    useEffect(() => {
        if (!currentCustomer && completed) {
            Promise.resolve().then(() => {
                setCompleted(false);
            })
        }
    }, [currentCustomer, completed, setCompleted]);

    const sortChangeHandler = useCallback((sort: SortProps<EDIOrder>) => {
        dispatch(setOrdersSort(sort));
    }, [dispatch]);

    const rowsPerPageHandler = useCallback((rowsPerPage: number) => {
        LocalStore.setItem<number>(STORAGE_KEYS.ROWS_PER_PAGE, rowsPerPage);
        setRowsPerPage(rowsPerPage);
        setPage(0);
    }, [setRowsPerPage, setPage])

    const value = useMemo<OrdersState>(() => ({
        formRef,
        count,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage: rowsPerPageHandler,
        sort,
        setSort: sortChangeHandler,
        completed,
        setCompleted,
        minDate,
        setMinDate,
        maxDate,
        setMaxDate,
    }), [count, page, rowsPerPage, sort, sortChangeHandler, rowsPerPageHandler, setPage, formRef,
        completed, setCompleted, minDate, maxDate, setMinDate, setMaxDate,
    ]);

    return (
        <OrdersContext value={value}>{children}</OrdersContext>
    )
}
