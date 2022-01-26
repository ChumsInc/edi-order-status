import {OrderFilter, OrderListState, StatusPopupKey} from "./types";
import {appStorage, STORAGE_KEYS} from "../../appStorage";

export const initialOrderFilter: OrderFilter = {
    Company: 'chums',
    ARDivisionNo: '',
    CustomerNo: '',
    CustomerPONo: '',
    minDate: '',
    maxDate: '',
    mapadoc: true,
}

export const initialOrderState: OrderListState = {
    loading: false,
    saving: false,
    filter: initialOrderFilter,
    list: [],
    sort: {field: 'CustomerNo', asc: true},
    autoRefresh: appStorage.getItem(STORAGE_KEYS.AUTO_REFRESH) || false,
}


export const noSelectedPopup:StatusPopupKey = {
    key: '',
    statusField: undefined,
}
