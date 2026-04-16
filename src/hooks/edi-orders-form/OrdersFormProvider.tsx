import {type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import OrdersFormContext, {type OrdersFormState} from "@/hooks/edi-orders-form/OrdersFormContext.tsx";
import {LocalStore} from "@chumsinc/ui-utils";
import {STORAGE_KEYS} from "../../storage-keys.ts";
import dayjs from "dayjs";
import {buildOrdersParams} from "@/ducks/orders/utils.ts";
import {loadOrders} from "@/ducks/orders/actions.ts";
import {useSearchParams} from "react-router";
import {selectCurrentCustomer, setCurrentCustomer} from "@/ducks/customers/customersSlice.ts";

const refreshInterval = 10 * 60 * 1000;

export interface OrdersFormProviderProps {
    children: ReactNode;
}

export default function OrdersFormProvider({children}: OrdersFormProviderProps) {
    const dispatch = useAppDispatch();
    const currentCustomer = useAppSelector(selectCurrentCustomer);
    const [params] = useSearchParams();
    const formRef = useRef<HTMLFormElement|null>(null);
    const [completed, setCompleted] = useState(false);
    const [minDate, setMinDate] = useState<string>('');
    const [maxDate, setMaxDate] = useState<string>('');
    const [autoRefresh, setAutoRefresh] = useState<boolean>(LocalStore.getItem<boolean>(STORAGE_KEYS.AUTO_REFRESH, false) ?? false);
    const [updated, setUpdated] = useState<number>(0);
    const interval = useRef<number>(0);
    const initialized = useRef<boolean>(false);

    const loadOrdersHandler = useCallback(async () => {
        // if this is the initial load, then from URL Search params as the form data has not been populated yet.
        const arg = initialized.current ? buildOrdersParams(formRef) : buildOrdersParams(params);
        initialized.current = true;
        await dispatch(loadOrders(arg));
        setUpdated(new Date().valueOf())
    }, [dispatch, setUpdated, formRef, params, initialized]);

    const updateParams = useCallback(async (params:URLSearchParams) => {
        const customer = params.get("customer") as string ?? null;
        if (customer !== currentCustomer) {
            dispatch(setCurrentCustomer(customer));
        }
        if (customer && params.has('completed')) {
            setCompleted(params.get('completed') === 'on')
        }
        setMinDate(params.has('minDate') ? params.get('minDate') as string : '');
        setMaxDate(params.has('maxDate') ? params.get('maxDate') as string : '');

    }, [currentCustomer, setMinDate, setMaxDate, setCompleted, dispatch]);

    useEffect(() => {
        new Promise((resolve) => resolve(updateParams(params))).then(loadOrdersHandler)
    }, [params, updateParams, loadOrdersHandler]);

    useEffect(() => {
        window.clearInterval(interval.current);
        if (autoRefresh) {
            if (!updated || dayjs(new Date()).diff(new Date(updated), 'seconds') > refreshInterval / 1000) {

                new Promise(loadOrdersHandler).catch(console.error);
            }
            interval.current = window.setInterval(loadOrdersHandler, refreshInterval);
        }
        return () => {
            window.clearInterval(interval.current);
        }
    }, [autoRefresh, interval, loadOrdersHandler, updated]);

    const autoRefreshChangeHandler = useCallback((checked: boolean) => {
        LocalStore.setItem<boolean>(STORAGE_KEYS.AUTO_REFRESH, checked);
        setAutoRefresh(checked);
    }, [setAutoRefresh]);

    const value = useMemo<OrdersFormState>(() => ({
        formRef,
        completed,
        setCompleted,
        minDate,
        setMinDate,
        maxDate,
        setMaxDate,
        autoRefresh,
        setAutoRefresh: autoRefreshChangeHandler,
        loadOrders:loadOrdersHandler,
        updated: updated ? dayjs(updated).format('HH:mm:ss') : 'never',
    }), [formRef, completed, setCompleted, minDate, maxDate, setMinDate, setMaxDate, autoRefresh, autoRefreshChangeHandler, loadOrdersHandler, updated]);

    return (
        <OrdersFormContext value={value}>{children}</OrdersFormContext>
    )
}
