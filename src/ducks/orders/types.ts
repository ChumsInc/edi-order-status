export type OrderStatusField = 'imported' | 'inventory' | 'printed' | 'logistics'
    | 'work-cell' | 'picked' | 'routed' | 'asn' | 'picked-up' | 'invoiced' | 'completed';

export interface OrderFilter {
    Company?: string,
    ARDivisionNo?: string,
    CustomerNo?: string,
    CustomerPONo?: string,
    showCompleted?: boolean,
    minDate?: string,
    maxDate?: string,
    OrderDate?: string,
    ShipExpireDate?: string,
    mapadoc?: boolean,
}

export interface OrderStatusUpdate {
    key: string,
    value: number,
}

export interface OrderStatus {
    user?: number,
    value: string | number,
    date?: string,
    text?: string,
    userName?: string,
}


export type OrderStatusGroup = {
    [key in OrderStatusField]: OrderStatus;
};

export interface EDIOrder {
    Company: string,
    ARDivisionNo: string,
    CustomerNo: string,
    SalesOrders: string,
    isMAPADOC: boolean,
    BillToName: string,
    OrderDate: string,
    OrderStatus: string,
    ShipExpireDate?: string,
    UDF_CANCEL_DATE?: string,
    LastInvoiceDate?: string,
    CustomerPONo: string,
    OrderTotal: number,
    OrderCount: number,
    InvoiceCount: number,
    CSUser: string,
    status_json: OrderStatusGroup,
    notes?: string,
    completed?: string | Date,
    completedByUserName?: string,
    selected?: boolean,
    saving?: boolean;
}

export interface EDIOrderList {
    [key: string]: EDIOrder;
}

export type OrderSortField = OrderStatusField | keyof EDIOrder;

export interface OrderSort {
    field: OrderSortField;
    asc: boolean;
}


export interface StatusPopupKey {
    key: string,
    statusField?: OrderStatusField,
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
    statusCode: OrderStatusUpdate
}

export interface PutOrderCommentArg {
    salesOrder: EDIOrder;
    comment: string;
}
