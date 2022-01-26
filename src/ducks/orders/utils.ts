import {EDIOrder} from "./types";
import {format, isThisYear, isToday, parseISO} from 'date-fns';
import {Customer} from "../customers";
import {FilterCustomer} from "../filters";

export const customerKey = (row: EDIOrder | Customer | FilterCustomer): string => `${row.ARDivisionNo}-${row.CustomerNo}`;

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
