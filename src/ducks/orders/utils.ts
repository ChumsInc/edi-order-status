import {EDIOrder, EDIOrderList, OrderSort} from "./types";
import {format, isThisYear, isToday, parseISO} from 'date-fns';
import {Customer} from "../customers";
import {FilterCustomer} from "../filters";
import Decimal from "decimal.js";
import dayjs from "dayjs";

export const customerKey = (row: EDIOrder | Customer | FilterCustomer): string => `${row.ARDivisionNo}-${row.CustomerNo}`;
export const customerFromKey = (key: string | null): FilterCustomer | null => {
    console.log('customerFromKey()', key)
    if (!key || !/\d{2}-[\dA-Z]+/.test(key)) {
        return null;
    }
    const [ARDivisionNo, CustomerNo] = key.split('-');
    return {
        Company: 'chums',
        ARDivisionNo,
        CustomerNo
    }
}

export const orderKey = (row: EDIOrder): string => `${row.ARDivisionNo}-${row.CustomerNo}:${row.CustomerPONo}/${row.OrderStatus}`;

export const orderStatusClassName = (value: string | number | null = '') => {
    switch (value) {
        case 1:
            return 'btn-info';
        case 2:
            return 'btn-success';
        case 3:
            return 'btn-warning';
        case 4:
            return 'btn-danger';
        case 5:
            return 'btn-dark';
        default:
            return 'btn-light';
    }
}

export const friendlyDate = (val: string | Date) => {
    const date = val instanceof Date ? val : parseISO(val);
    if (isThisYear(date)) {
        return format(date, 'MM/dd')
    }
    return format(date, 'MM/dd/yyyy');
}
export const friendlyDateTime = (val: string | Date) => {
    const date = val instanceof Date ? val : parseISO(val);
    if (isToday(date)) {
        return format(date, 'HH:mm')
    }
    return friendlyDate(date);
}

export const listToEDIOrders = (list: EDIOrderList): EDIOrder[] => {
    return Object.values(list);
}

export const orderSorter = (sort: OrderSort) => (a: EDIOrder, b: EDIOrder) => {
    const {field, asc} = sort;
    const sortMod = asc ? 1 : -1;
    switch (field) {
        case 'ARDivisionNo':
        case 'CustomerNo':
            return (
                customerKey(a).toUpperCase() === customerKey(b).toUpperCase()
                    ? (orderKey(a) > orderKey(b) ? 1 : -1)
                    : (customerKey(a).toUpperCase() > customerKey(b).toUpperCase() ? 1 : -1)
            ) * sortMod;
        case 'BillToName':
        case 'CustomerPONo':
        case 'OrderStatus':
        case 'SalesOrders':
            return (
                a[field].toUpperCase() === b[field].toUpperCase()
                    ? (orderKey(a) > orderKey(b) ? 1 : -1)
                    : (a[field].toUpperCase() > b[field].toUpperCase() ? 1 : -1)
            ) * sortMod;
        case 'OrderTotal':
        case 'OrderCount':
        case 'InvoiceCount':
            let difference = new Decimal(a[field]).sub(b[field]);
            return difference.eq(0)
                ? (orderKey(a) > orderKey(b) ? 1 : -1) * sortMod
                : difference.times(sortMod).toNumber();
        case 'OrderDate':
            return (
                dayjs(a[field]).isSame(b[field], 'day')
                ? (orderKey(a) > orderKey(b) ? 1 : -1)
                : (dayjs(a[field]).isAfter(b[field]) ? 1 : -1)
            ) * sortMod;
        case 'ShipExpireDate':
        case 'UDF_CANCEL_DATE':
        case 'LastInvoiceDate':
            return (
                !dayjs(a[field]).isValid() || !dayjs(b[field]).isValid() || dayjs(a[field]).isSame(b[field], 'day')
                ? (orderKey(a) > orderKey(b) ? 1 : -1)
                : (dayjs(a[field]).isAfter(b[field]) ? 1 : -1)
            ) * sortMod;
        default:
            return (orderKey(a) > orderKey(b) ? 1 : -1) * sortMod;
    }
}
