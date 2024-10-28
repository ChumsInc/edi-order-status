import {EDIOrder} from "chums-types";
import {loadOrders, saveOrderComment, saveOrderStatus, setSortField, toggleOrderSelected} from "./actions";
import {orderKey} from "./utils";
import {STORAGE_KEYS} from '../../storage-keys';
import {createReducer} from "@reduxjs/toolkit";
import {LocalStore} from "chums-components";
import {SortProps} from "chums-types";
import {EDIOrderList} from "./types";

export interface OrderListState {
    loading: 'idle'|'loading',
    list: EDIOrderList;
    sort: SortProps<EDIOrder>;
    autoRefresh: boolean,
}

export const initialOrderState = (): OrderListState => ({
    loading: 'idle',
    list: {},
    sort: {field: 'UDF_CANCEL_DATE', ascending: true},
    autoRefresh: LocalStore.getItem<boolean>(STORAGE_KEYS.AUTO_REFRESH, false) ?? false,
})


const ordersReducer = createReducer(initialOrderState, builder => {
    builder
        .addCase(loadOrders.pending, (state) => {
            state.loading = 'loading';
        })
        .addCase(loadOrders.fulfilled, (state, action) => {
            state.loading = 'idle';
            state.list = {}
            action.payload.map(row => {
                state.list[orderKey(row)] = row;
            });
        })
        .addCase(loadOrders.rejected, (state) => {
            state.loading = 'idle';
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
