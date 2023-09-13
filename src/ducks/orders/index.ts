import {EDIOrderList, OrderSort} from "./types";
import {loadOrders, saveOrderComment, saveOrderStatus, setSortField, toggleOrderSelected} from "./actions";
import {orderKey} from "./utils";
import {STORAGE_KEYS} from '../../appStorage';
import {createReducer} from "@reduxjs/toolkit";
import {LocalStore} from "chums-components";

export interface OrderListState {
    loading: boolean,
    list: EDIOrderList;
    sort: OrderSort;
    autoRefresh: boolean,
}

export const initialOrderState = (): OrderListState => ({
    loading: false,
    list: {},
    sort: {field: 'CustomerNo', asc: true},
    autoRefresh: LocalStore.getItem<boolean>(STORAGE_KEYS.AUTO_REFRESH, false) ?? false,
})


const ordersReducer = createReducer(initialOrderState, builder => {
    builder
        .addCase(loadOrders.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(loadOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.list = {}
            action.payload.map(row => {
                state.list[orderKey(row)] = row;
            });
        })
        .addCase(loadOrders.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveOrderStatus.pending, (state, action) => {
            const key = orderKey(action.meta.arg.salesOrder)
            state.list[key].saving = true;
        })
        .addCase(saveOrderStatus.fulfilled, (state, action) => {
            const key = orderKey(action.meta.arg.salesOrder);
            if (!action.payload) {
                delete state.list[key];
            } else {
                state.list[key] = action.payload;
            }
        })
        .addCase(saveOrderStatus.rejected, (state, action) => {
            const key = orderKey(action.meta.arg.salesOrder);
            state.list[key].saving = false;
        })
        .addCase(saveOrderComment.pending, (state, action) => {
            const key = orderKey(action.meta.arg.salesOrder)
            state.list[key].saving = true;
        })
        .addCase(saveOrderComment.fulfilled, (state, action) => {
            const key = orderKey(action.meta.arg.salesOrder);
            if (!action.payload) {
                delete state.list[key];
            } else {
                state.list[key] = action.payload;
            }
        })
        .addCase(saveOrderComment.rejected, (state, action) => {
            const key = orderKey(action.meta.arg.salesOrder);
            state.list[key].saving = false;
        })
        .addCase(toggleOrderSelected, (state, action) => {
            if (action.payload.list.length === 1) {
                state.list[action.payload.list[0]].selected = action.payload.checked;
            } else {
                Object.keys(state.list).forEach(key => {
                    state.list[key].selected = false;
                })
                action.payload.list.forEach(key => {
                    state.list[key].selected = action.payload.checked;
                });
            }
        })
        .addCase(setSortField, (state, action) => {
            state.sort = action.payload;
        })
});


export default ordersReducer;
