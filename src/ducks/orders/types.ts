import type {EDIOrder} from "chums-types";

export interface OrderStatusUpdate {
    statusCode: string,
    value: number,
}

export interface EDIOrderList {
    [key: string]: EDIOrder;
}

export interface FetchOrdersArg {
    customerKey?: string|null;
    ARDivisionNo?: string|null;
    CustomerNo?: string|null;
    completed?: boolean|string|null;
    minDate?: string|null;
    maxDate?: string|null;
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
