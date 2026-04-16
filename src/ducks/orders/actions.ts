import type {FetchOrdersArg, OrderStatusUpdate, PutOrderCommentArg, PutOrderStatusArg} from "./types";
import {selectCheckedOrders, selectOrderById, selectOrderSaving, selectOrdersStatus} from "./ordersSlice";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchOrders, putOrderComment, putOrderStatus} from "./api";
import {orderKey} from "./utils";
import type {EDIOrder} from "chums-types";
import type {RootState} from "@/app/configureStore.ts";


export const loadOrders = createAsyncThunk<EDIOrder[], FetchOrdersArg, { state: RootState }>(
    'orders/load',
    async (arg) => {
        return await fetchOrders(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState();
            return selectOrdersStatus(state) === 'idle';
        }
    }
)

export const saveOrderStatus = createAsyncThunk<EDIOrder | null, PutOrderStatusArg, {state:RootState}>(
    'orders/saveStatus',
    async (arg) => {
        return await putOrderStatus(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            const key = orderKey(arg.salesOrder);
            return selectOrderById(state, key) &&
                !selectOrderSaving(state, key);
        }
    }
)

export const saveSelectedStatus = createAsyncThunk<void, OrderStatusUpdate, {state:RootState}>(
    'orders/selected/save',
    async (arg, {dispatch, getState}) => {
        const state = getState();
        const orders = selectCheckedOrders(state);
        for await (const order of orders) {
            await dispatch(saveOrderStatus({salesOrder: order, status: arg}));
        }
    }, {
        condition: (_, {getState}) => {
            const state = getState();
            return selectOrdersStatus(state) === 'idle';
        }
    }
)

export const saveOrderComment = createAsyncThunk<EDIOrder | null, PutOrderCommentArg, {state:RootState}>(
    'orders/saveComment',
    async (arg) => {
        return await putOrderComment(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !selectOrderSaving(state, orderKey(arg.salesOrder));
        }

    }
)
