import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {EDIOrder, SortProps} from "chums-types";
import {customerKey, isTestCustomer, orderKey, orderSorter} from "@/ducks/orders/utils.ts";
import {dismissAlert} from "@chumsinc/alert-list";
import {loadOrders, saveOrderComment, saveOrderStatus} from "@/ducks/orders/actions.ts";
import {
    selectCurrentCustomer,
    selectShowMAPADOCOnly,
    selectShowTestCustomer,
    setCurrentCustomer
} from "@/ducks/customers/customersSlice.ts";
import dayjs from "dayjs";
import {selectOrderDateFilter} from "@/ducks/filters";

const adapter = createEntityAdapter<EDIOrder, string>({
    selectId: (arg) => orderKey(arg),
    sortComparer: (a, b) => orderKey(a).localeCompare(orderKey(b)),
});

const selectors = adapter.getSelectors();

export interface OrdersState {
    status: 'idle' | 'loading' | 'rejected';
    sort: SortProps<EDIOrder>;
    orderDate: string | null;
    shipDate: string | null;
}

const extraState = (): OrdersState => {
    const params = new URLSearchParams(window.location.search);
    return {
        status: 'idle',
        sort: {field: 'UDF_CANCEL_DATE', ascending: true},
        orderDate: params.get('orderDate') ?? null,
        shipDate: params.get('shipDate') ?? null,
    }
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState: adapter.getInitialState(extraState()),
    reducers: {
        setOrdersSort: (state, action: PayloadAction<SortProps<EDIOrder>>) => {
            state.sort = action.payload;
        },
        setOrderDate: (state, action: PayloadAction<string | null>) => {
            state.orderDate = action.payload;
        },
        setShipDate: (state, action: PayloadAction<string | null>) => {
            state.shipDate = action.payload;
        },
        toggleOrderSelected: (state, action: PayloadAction<{ list: string[], checked: boolean }>) => {
            const changes = action.payload.list.map(key => ({
                id: key,
                changes: {selected: action.payload.checked}
            }));
            adapter.updateMany(state, changes);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setCurrentCustomer, (state) => {
                state.orderDate = null;
                state.shipDate = null;
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context?.startsWith('orders/')) {
                    state.status = 'idle';
                }
            })
            .addAsyncThunk(loadOrders, {
                pending: (state) => {
                    state.status = 'loading';
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    adapter.setAll(state, action.payload);
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })
            .addAsyncThunk(saveOrderStatus, {
                pending: (state, action) => {
                    adapter.updateOne(state, {
                        id: orderKey(action.meta.arg.salesOrder),
                        changes: {saving: true}
                    })
                },
                fulfilled: (state, action) => {
                    if (action.payload) {
                        adapter.setOne(state, action.payload)
                    } else {
                        adapter.removeOne(state, orderKey(action.meta.arg.salesOrder));
                    }
                },
                rejected: (state, action) => {
                    adapter.updateOne(state, {
                        id: orderKey(action.meta.arg.salesOrder),
                        changes: {saving: false}
                    })
                }
            })
            .addAsyncThunk(saveOrderComment, {
                pending: (state, action) => {
                    adapter.updateOne(state, {
                        id: orderKey(action.meta.arg.salesOrder),
                        changes: {saving: true}
                    })
                },
                fulfilled: (state, action) => {
                    if (action.payload) {
                        adapter.upsertOne(state, action.payload)
                    } else {
                        adapter.removeOne(state, orderKey(action.meta.arg.salesOrder));
                    }
                },
                rejected: (state, action) => {
                    adapter.updateOne(state, {
                        id: orderKey(action.meta.arg.salesOrder),
                        changes: {saving: false}
                    })
                }
            })
    },
    selectors: {
        selectOrdersStatus: (state) => state.status,
        selectOrdersList: (state) => selectors.selectAll(state),
        selectOrdersSort: (state) => state.sort,
        selectOrdersCount: (state) => selectors.selectTotal(state),
        selectOrderById: (state, key) => selectors.selectById(state, key) ?? null,
        selectOrderSaving: (state, key) => selectors.selectById(state, key).saving ?? false,
        selectOrderDate: (state) => state.orderDate,
        selectShipDate: (state) => state.shipDate,
    }
});

export default ordersSlice;
export const {
    setOrdersSort,
    setOrderDate,
    toggleOrderSelected,
    setShipDate,
} = ordersSlice.actions;
export const {
    selectOrdersStatus,
    selectOrdersSort,
    selectOrdersCount,
    selectOrdersList,
    selectOrderSaving,
    selectOrderById,
    selectOrderDate,
    selectShipDate,
} = ordersSlice.selectors;

export const selectCheckedOrders = createSelector(
    [selectOrdersList, selectOrdersSort],
    (list, sort) => {
        return list.filter(row => row.selected)
            .sort(orderSorter(sort));
    }
)


export const selectFilteredOrdersList = createSelector(
    [
        selectCurrentCustomer,
        selectShowTestCustomer,
        selectShowMAPADOCOnly,
        selectShipDate,
        selectOrderDate,
        selectOrdersList,
        selectOrdersSort
    ],
    (customer, showTestCustomer, onlyMAPADOC, shipDateFilter, orderDateFilter, list, sort) => {
        const orderDate = !orderDateFilter ? null : dayjs(orderDateFilter);
        const shipDate = !shipDateFilter ? null : dayjs(shipDateFilter);
        return list
            .filter(order => !customer || customerKey(order) === customer)
            .filter(order => showTestCustomer || !isTestCustomer(order))
            .filter(order => !onlyMAPADOC || order.isMAPADOC)
            .filter(order => !orderDate || orderDate.isSame(order.OrderDate, 'date'))
            .filter(order => !shipDate
                || (shipDateFilter === 'closed' && order.OrderStatus === 'C')
                || (order.ShipExpireDate && shipDate.isSame(order.ShipExpireDate, 'date'))
                || (order.LastInvoiceDate && shipDate.isSame(order.LastInvoiceDate, 'date'))
            )
            .sort(orderSorter(sort))
    }
)

export const selectFilteredOrdersCount = createSelector(
    [selectFilteredOrdersList],
    (list) => {
        return list.length;
    }
)

export const selectOrderDates = createSelector(
    [selectCurrentCustomer, selectShowTestCustomer, selectShowMAPADOCOnly, selectOrdersList],
    (customer, showTestCustomer, onlyMAPADOC, list) => {
        const dates: string[] = list
            .filter(order => showTestCustomer || !isTestCustomer(order))
            .filter(order => !customer || customerKey(order) === customer)
            .filter(order => !onlyMAPADOC || order.isMAPADOC)
            .map(order => order.OrderDate)
            .reduce((pv, orderDate) => {
                if (!pv.includes(orderDate)) {
                    return [...pv, orderDate]
                }
                return pv;
            }, [] as string[])
        return dates.sort();
    }
);

export const selectShipDates = createSelector(
    [selectCurrentCustomer, selectShowTestCustomer, selectShowMAPADOCOnly, selectOrdersList, selectOrderDateFilter],
    (customer, showTestCustomer, onlyMAPADOC, list, orderDate) => {
        const dates: string[] = list
            .filter(order => !customer || customerKey(order) === customer)
            .filter(order => !showTestCustomer || !isTestCustomer(order))
            .filter(order => !onlyMAPADOC || order.isMAPADOC)
            .filter(order => !orderDate || order.OrderDate === orderDate)
            .reduce((pv, order) => {
                const _dates = [...pv];
                if (!_dates.includes(order.ShipExpireDate)) {
                    _dates.push(order.ShipExpireDate);
                }
                if (order.LastInvoiceDate && !_dates.includes(order.LastInvoiceDate)) {
                    _dates.push(order.LastInvoiceDate)
                }
                return _dates;
            }, [] as string[]);
        return Object.values(dates).sort();
    }
);


export const selectCountChecked = createSelector(
    [selectOrdersList],
    (list) => {
        return list.filter(so => so.selected).length;
    }
)
