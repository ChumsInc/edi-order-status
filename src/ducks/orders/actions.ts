import type {FetchOrdersArg, OrderStatusUpdate, PutOrderCommentArg, PutOrderStatusArg} from "./types";
import {selectCheckedOrders, selectOrderById, selectOrderSaving, selectOrdersStatus} from "./ordersSlice";
import {type FilterCustomer} from "../filters";
import {createAsyncThunk} from "@reduxjs/toolkit";
import type {RootState} from "../../app/configureStore";
import {fetchOrders, putOrderComment, putOrderStatus} from "./api";
import {orderKey} from "./utils";
import type {EDIOrder} from "chums-types";


export interface CompletedURLProps {
    customer: FilterCustomer | null,
    minDate: string,
    maxDate: string,
}


export const loadOrders = createAsyncThunk<EDIOrder[], FetchOrdersArg, {state:RootState}>(
    'orders/load',
    async (arg) => {
        return await fetchOrders(arg);
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
