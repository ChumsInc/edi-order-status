import {ActionInterface} from "../types";

export interface OrderFilter {
    company?: string,
    arDivisionNo?: string,
    customerNo?: string,
    customerPONo?: string,
    search?: string,
    rowsPerPage?: number,
    page?: number,
}

export interface OrderStatus {
    user: number,
    value: string|number,
    date: string,
    text: string,
}

export interface OrderStatusGroup {
    [key:string]: OrderStatus
}

export interface EDIOrder {
    Company: string,
    ARDivisionNo: string,
    CustomerNo: string,
    BillToName: string,
    OrderDate: string,
    OrderType: 'S'|'B',
    ShipExpireDate: string,
    UDF_CANCEL_DATE?: string,
    CustomerPONo: string,
    OrderTotal:number,
    OrderCount: number,
    CSUser: string,
    status_json: OrderStatusGroup,
    notes?: string,
}

export interface OrderListState {
    loading: boolean,
    saving: boolean,
    filter: OrderFilter,
    list: EDIOrder[],
}

export interface EDIOrdersAction extends ActionInterface {
    payload?: {
        filter?: OrderFilter,
        list?: EDIOrder[],
    }
}
