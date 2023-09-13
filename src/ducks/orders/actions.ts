import {EDIOrder, OrderSort, OrderStatusUpdate, PutOrderCommentArg, PutOrderStatusArg} from "./types";
import {selectOrderSaving, selectOrdersLoading, selectSalesOrder, selectSelectedOrders} from "./selectors";
import {
    FilterCustomer,
    selectCustomerFilter,
    selectMaxDateFilter,
    selectMinDateFilter,
    selectShowCompletedFilter
} from "../filters";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {fetchOrders, putOrderComment, putOrderStatus} from "./api";
import {orderKey} from "./utils";


export interface CompletedURLProps {
    customer: FilterCustomer | null,
    minDate: string,
    maxDate: string,
}


export const loadOrders = createAsyncThunk<EDIOrder[]>(
    'orders/load',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerFilter(state);
        const minDate = selectMinDateFilter(state);
        const maxDate = selectMaxDateFilter(state);
        const completed = selectShowCompletedFilter(state);
        return await fetchOrders({...customer, completed, minDate, maxDate});
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectOrdersLoading(state);
        }
    }
)

export const saveOrderStatus = createAsyncThunk<EDIOrder | null, PutOrderStatusArg>(
    'orders/saveStatus',
    async (arg) => {
        return await putOrderStatus(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const key = orderKey(arg.salesOrder);
            return !!selectSalesOrder(state, key) &&
                !selectOrderSaving(state, key);
        }
    }
)

function wait(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(null), ms);
    });
}

export const saveSelectedStatus = createAsyncThunk<void, OrderStatusUpdate>(
    'orders/selected/save',
    async (arg, {dispatch, getState}) => {
        const state = getState() as RootState;
        const selectedOrders = selectSelectedOrders(state);
        for await (const order of selectedOrders) {
            await dispatch(saveOrderStatus({salesOrder: order, statusCode: arg}));
        }
    }
)

export const saveOrderComment = createAsyncThunk<EDIOrder | null, PutOrderCommentArg>(
    'orders/saveComment',
    async (arg) => {
        return await putOrderComment(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectOrderSaving(state, orderKey(arg.salesOrder));
        }

    }
)
export const setSortField = createAction<OrderSort>('orders/setSort');

export const toggleOrderSelected = createAction<{ list: string[], checked: boolean }>('orders/toggleSelected');
