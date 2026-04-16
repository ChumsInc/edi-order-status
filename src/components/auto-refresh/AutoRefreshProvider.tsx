import {type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {loadOrders} from "@/ducks/orders/actions.ts";
import AutoRefreshContext, {type AutoRefreshState} from "@/components/auto-refresh/AutoRefreshContext.tsx";
import {selectOrdersList, selectOrdersStatus} from "@/ducks/orders/ordersSlice.ts";
import dayjs from "dayjs";
import {LocalStore} from "@chumsinc/ui-utils";
import {STORAGE_KEYS} from "../../storage-keys.ts";

const refreshInterval = 10 * 60 * 1000;

export interface AutoRefreshProviderProps {
    children: ReactNode;
}

export default function AutoRefreshProvider({children}: AutoRefreshProviderProps) {
    const dispatch = useAppDispatch();
    const orders = useAppSelector(selectOrdersList);
    const status = useAppSelector(selectOrdersStatus);
    const [checked, setChecked] = useState<boolean>(LocalStore.getItem<boolean>(STORAGE_KEYS.AUTO_REFRESH, false) ?? false);
    const [updated, setUpdated] = useState<number>(0);
    const interval = useRef<number>(0);

    const refreshHandler = useCallback(async () => {
        if (checked) {
            await dispatch(loadOrders());
            setUpdated(new Date().valueOf())
        }
    }, [dispatch, checked, setUpdated]);

    useEffect(() => {
        window.clearInterval(interval.current);
        if (checked) {
            if (!updated || dayjs(new Date()).diff(new Date(updated), 'seconds') > refreshInterval / 1000) {
                new Promise(refreshHandler).catch(console.error);
            }
            interval.current = window.setInterval(refreshHandler, refreshInterval);
        }
        return () => {
            window.clearInterval(interval.current);
        }
    }, [checked, interval, refreshHandler, updated]);

    useEffect(() => {
        if (orders.length > 0 && status === 'idle') {
            Promise.resolve().then(() => {
                setUpdated(new Date().valueOf())
            })
        }
    }, [orders, status, setUpdated]);

    const checkedChangeHandler = useCallback((checked: boolean) => {
        LocalStore.setItem<boolean>(STORAGE_KEYS.AUTO_REFRESH, checked);
        setChecked(checked);
    }, [setChecked]);

    const state = useMemo<AutoRefreshState>(() => ({
        checked,
        setChecked: checkedChangeHandler,
        updated: updated ? dayjs(updated).format('HH:mm:ss') : 'never',
    }), [checked, checkedChangeHandler, updated]);

    return (
        <AutoRefreshContext value={state}>{children}</AutoRefreshContext>
    )
}
