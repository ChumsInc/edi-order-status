import {OrderFilter, OrderListState, StatusPopupKey} from "./types";

export const initialOrderFilter: OrderFilter = {
    Company: 'chums',
    ARDivisionNo: '',
    CustomerNo: '',
    CustomerPONo: '',
    minDate: '',
    maxDate: '',
}

export const initialOrderState: OrderListState = {
    loading: false,
    saving: false,
    filter: initialOrderFilter,
    list: [],
    sort: {field: 'CustomerNo', asc: true}
}

export const noSelectedPopup:StatusPopupKey = {
    key: '',
    statusField: '',
}
