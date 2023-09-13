import {RootState} from "../../app/configureStore";
import {createSelector} from "reselect";
import {customerKey, listToEDIOrders, orderSorter} from "./utils";
import {selectCustomerFilter, selectMapadocFilter, selectOrderDateFilter, selectShipDateFilter} from "../filters";


export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersList = (state: RootState) => state.orders.list;
export const selectOrderSort = (state: RootState) => state.orders.sort;


export const selectSelectedOrders = createSelector(
    [selectOrdersList, selectOrderSort],
    (list, sort) => {
        return listToEDIOrders(list)
            .filter(row => row.selected)
            .sort(orderSorter(sort));
    }
)


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
        return listToEDIOrders(list)
            .filter(order => {
                return (!custKey || customerKey(order) === custKey)
                    && (!mapadoc || order.isMAPADOC)
                    && (!orderDate || new Date(order.OrderDate).valueOf() === orderDate.valueOf())
                    && (!shipDate
                        || (shipDateFilter === 'closed' && order.OrderStatus === 'C')
                        || (!!order.ShipExpireDate && new Date(order.ShipExpireDate).valueOf() === shipDate.valueOf())
                        || (!!order.LastInvoiceDate && new Date(order.LastInvoiceDate).valueOf() === shipDate.valueOf()))
            })
            .sort(orderSorter(sort))
    }
)

export const selectSalesOrder = createSelector(
    [selectOrdersList, (state, key) => key],
    (list, key) => {
        return list[key] ?? null;
    }
)

export const selectOrderSaving = createSelector(
    [selectOrdersList, (state, key) => key],
    (list, key) => {
        return list[key]?.saving ?? false;
    }
)

export const selectOrderDates = createSelector(
    [selectCustomerFilter, selectMapadocFilter, selectOrdersList],
    (customer, mapadoc, list) => {
        const dates: { [key: string]: string } = {};
        const key:string|null = customer === null ? null : customerKey(customer);
        listToEDIOrders(list)
            .filter(order => !key || customerKey(order) === key)
            .filter(order => !mapadoc || order.isMAPADOC)
            .filter(order => !dates[order.OrderDate])
            .forEach(order => dates[order.OrderDate] = order.OrderDate);
        return Object.values(dates).sort();
    })

export const selectShipDates = createSelector(
    [selectCustomerFilter, selectMapadocFilter, selectOrdersList],
    (customer, mapadoc, list) => {
        const dates: { [key: string]: string } = {};
        const key = customer === null ? null : customerKey(customer);
        listToEDIOrders(list)
            .filter(order => !key || customerKey(order) === key)
            .filter(order => !mapadoc || order.isMAPADOC)
            .filter(order => !!order.ShipExpireDate)
            .forEach(order => {
                if (order.ShipExpireDate && !dates[order.ShipExpireDate]) {
                    dates[order.ShipExpireDate] = order.ShipExpireDate;
                }
            });
        return Object.values(dates).sort();
    })
export const selectCountChecked = createSelector(
    [selectOrdersList],
    (list) => {
        return listToEDIOrders(list)
            .filter(so => so.selected)
            .length;
    }
)
