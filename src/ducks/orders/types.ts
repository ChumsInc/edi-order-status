import {EDIOrder} from "chums-types";

export interface OrderStatusUpdate {
    statusCode: string,
    value: number,
}

export interface EDIOrderList {
    [key: string]: EDIOrder;
}

export interface FetchOrdersArg {
    ARDivisionNo?: string;
    CustomerNo?: string;
    completed?: boolean;
    minDate?: string;
    maxDate?: string;
}

export interface FetchOrdersResponse {
    salesOrders?: EDIOrder[],
    error?: string;
}

export interface PutOrderStatusArg {
    salesOrder: EDIOrder;
    status: OrderStatusUpdate
}

export interface PutOrderCommentArg {
    salesOrder: EDIOrder;
    comment: string;
}
