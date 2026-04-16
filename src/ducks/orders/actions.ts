import type {OrderStatusUpdate, PutOrderCommentArg, PutOrderStatusArg} from "./types";
import {selectCheckedOrders, selectOrderById, selectOrderSaving, selectOrdersStatus} from "./ordersSlice";
import {type FilterCustomer, selectMaxDateFilter, selectMinDateFilter, selectShowCompletedFilter} from "../filters";
import {createAsyncThunk} from "@reduxjs/toolkit";
import type {RootState} from "../../app/configureStore";
import {fetchOrders, putOrderComment, putOrderStatus} from "./api";
import {customerFromKey, orderKey} from "./utils";
import type {EDIOrder} from "chums-types";
import {selectCurrentCustomer} from "@/ducks/customers/customersSlice.ts";


export interface CompletedURLProps {
    customer: FilterCustomer | null,
    minDate: string,
    maxDate: string,
}


export const loadOrders = createAsyncThunk<EDIOrder[]>(
    'orders/load',
    async (_, {getState}) => {
        const state = getState() as RootState;
        const currentCustomer = selectCurrentCustomer(state);
        const customer = currentCustomer ? customerFromKey(currentCustomer) : {};
        const minDate = selectMinDateFilter(state);
        const maxDate = selectMaxDateFilter(state);
        const completed = selectShowCompletedFilter(state);
        return await fetchOrders({...customer, completed, minDate, maxDate});
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectOrdersStatus(state) === 'idle';
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
            return selectOrderById(state, key) &&
                !selectOrderSaving(state, key);
        }
    }
)

export const saveSelectedStatus = createAsyncThunk<void, OrderStatusUpdate>(
    'orders/selected/save',
    async (arg, {dispatch, getState}) => {
        const state = getState() as RootState;
        const orders = selectCheckedOrders(state);
        for await (const order of orders) {
            await dispatch(saveOrderStatus({salesOrder: order, status: arg}));
        }
    }, {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectOrdersStatus(state) === 'idle';
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
