import {ActionInterface} from "../types";
import {ActionPayload} from "chums-connected-components";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";

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
}

export interface OrderSort {
    field: OrderStatusField|EDIOrderField,
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

export interface EDIOrdersPayload extends ActionPayload {
    filter?: OrderFilter,
    list?: EDIOrder[],
    salesOrder?: EDIOrder,
    statusPopupKey?: StatusPopupKey,
    field?: string,
    selectedList?: string[],
    selected?: boolean,
}

export interface EDIOrdersAction extends ActionInterface {
    payload?: EDIOrdersPayload,
}

export interface EDIOrdersThunkAction extends ThunkAction<any, RootState, unknown, EDIOrdersAction> {}

export interface EDIOrderSort {
    [key: string]: (row: EDIOrder) => string | number,
}

export interface EDIOrderSortParams {
    list: EDIOrder[],
    field: string,
    asc: boolean,
}

export type SortFunction = (a: EDIOrder, b: EDIOrder) => number;

export type EDIOrderField = keyof EDIOrder;

export type EDIOrderSorterKey = EDIOrderField|OrderStatusField;
export type EDIOrderSorter = {
    [key in EDIOrderSorterKey]: SortFunction;
};

export interface StatusPopupKey {
    key: string,
    statusField?: OrderStatusField,
}
