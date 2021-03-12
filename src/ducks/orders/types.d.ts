import {ActionInterface} from "../types";

export type OrderStatusField = 'imported' | 'inventory' | 'printed' | 'logistics' | 'work-cell' | 'picked' | 'routed'
    | 'asn' | 'picked-up' | 'invoiced' | 'completed' | '';

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
    mapadoc?:boolean,
}

export interface OrderStatusUpdate {
    key: string,
    value: number,
}

export interface OrderStatusTitles {
    imported?: string,
    inventory?: string,
    printed?: string,
    logistics?: string,
    'work-cell'?: string,
    picked?: string,
    routed?: string,
    'picked-up'?: string,
    asn?: string,
}

export interface OrderStatus {
    user?: number,
    value: string | number,
    date?: string,
    text?: string,
    userName?: string,
}

export type OrderStatusGroup = {
    [key: string]: OrderStatus;
};

export interface EDIOrder {
    Company: string,
    ARDivisionNo: string,
    CustomerNo: string,
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
}

export interface OrderSort {
    field: string,
    asc: boolean,
}

export interface OrderListState {
    loading: boolean,
    saving: boolean,
    filter: OrderFilter,
    list: EDIOrder[],
    sort: OrderSort,
    autoRefresh: boolean,
}

export interface EDIOrdersAction extends ActionInterface {
    payload?: {
        filter?: OrderFilter,
        list?: EDIOrder[],
        salesOrder?: EDIOrder,
        statusPopupKey?: StatusPopupKey,
        field?: string,
        selectedList?: string[],
        selected?: boolean,
    }
}

export interface EDIOrderSort {
    [key: string]: (row: EDIOrder) => string | number,
}

export interface EDIOrderSortParams {
    list: EDIOrder[],
    field: string,
    asc: boolean,
}

export type SortFunction = (a: any, b: any) => number;

export interface EDIOrderSorter {
    [key: string]: SortFunction
}

export interface StatusPopupKey {
    key: string,
    statusField?: OrderStatusField,
}
