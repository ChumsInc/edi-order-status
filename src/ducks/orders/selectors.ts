import {RootState} from "../index";
import {createSelector} from "reselect";
import {orderSorter} from "./EDIOrderSorter";
import {selectCustomerFilter, selectMapadocFilter, selectOrderDateFilter, selectShipDateFilter} from "../filters";
import {customerKey} from "./utils";


export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersSaving = (state: RootState) => state.orders.saving;
export const selectOrdersFilter = (state: RootState) => state.orders.filter;
export const selectOrdersList = (state: RootState) => state.orders.list;
export const selectOrdersListLength = (state: RootState) => state.orders.list.length;
export const selectAutoRefresh = (state: RootState) => state.orders.autoRefresh;
export const selectMAPADOC = (state: RootState) => state.orders.filter.mapadoc;
export const selectOrderSort = (state: RootState) => state.orders.sort;
export const selectStatusPopup = (state: RootState) => state.orders.statusPopup;

export const selectFilteredOrdersList = createSelector(
    [
        selectCustomerFilter,
        selectMapadocFilter,
        selectShipDateFilter,
        selectOrderDateFilter,
        selectOrdersList,
        selectOrderSort
    ],
    (customer, mapadoc, shipDateFilter, orderDateFilter, list, sort) => {
        const custKey = customer === null ? null : customerKey(customer);
        const orderDate = !orderDateFilter ? null : new Date(orderDateFilter);
        const shipDate = !shipDateFilter ? null : new Date(shipDateFilter);
        return list
            .filter(order => {
                return (!custKey || customerKey(order) === custKey)
                    && (!mapadoc || order.isMAPADOC)
                    && (!orderDate || new Date(order.OrderDate).valueOf() === orderDate.valueOf())
                    && (!shipDate || (!!order.ShipExpireDate && new Date(order.ShipExpireDate).valueOf() === shipDate.valueOf()) || (!!order.LastInvoiceDate && new Date(order.LastInvoiceDate).valueOf() === shipDate.valueOf()))
            })
            .sort(orderSorter(sort))
    }
)


export const selectOrderDates = createSelector(
    [selectCustomerFilter, selectMapadocFilter, selectOrdersList],
    (customer, mapadoc, list) => {
        const dates: { [key: string]: string } = {};
        const custKey = customer === null ? null : customerKey(customer);
        list.filter(order => !custKey || customerKey(order) === custKey)
            .filter(order => !mapadoc || order.isMAPADOC)
            .forEach(order => dates[order.OrderDate] = order.OrderDate);
        return Object.values(dates).sort();
    })

export const selectShipDates = createSelector(
    [selectCustomerFilter, selectMapadocFilter, selectOrdersList],
    (customer, mapadoc, list) => {
        const dates: { [key: string]: string } = {};
        const custKey = customer === null ? null : customerKey(customer);
        list.filter(order => !custKey || customerKey(order) === custKey)
            .filter(order => !mapadoc || order.isMAPADOC)
            .forEach(order => {
                if (!!order.ShipExpireDate) {
                    dates[order.ShipExpireDate] = order.ShipExpireDate
                }
            });
        return Object.values(dates).sort();
    })
