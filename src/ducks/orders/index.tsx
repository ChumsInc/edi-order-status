import {combineReducers} from 'redux';
import {EDIOrder, EDIOrdersAction, OrderFilter, OrderListState} from "./types";
import {
    FETCH_ORDERS,
    FETCH_ORDERS_FAILED,
    FETCH_ORDERS_SUCCESS,
    FILTER_ORDERS,
    PUT_ORDER,
    PUT_ORDER_FAILED,
    PUT_ORDER_SUCCESS
} from "./actions";


const initialOrderFilter: OrderFilter = {
    company: 'chums',
    arDivisionNo: '',
    customerNo: '',
    customerPONo: '',
    search: '',
    rowsPerPage: 25,
    page: 1,
}

const initialOrderState: OrderListState = {
    loading: false,
    saving: false,
    filter: initialOrderFilter,
    list: [],
}

const loadingReducer = (state = initialOrderState.loading, action: EDIOrdersAction): boolean => {
    switch (action.type) {
    case FETCH_ORDERS:
        return true;
    case FETCH_ORDERS_SUCCESS:
    case FETCH_ORDERS_FAILED:
        return false;
    default:
        return state;
    }
}

const savingReducer = (state = initialOrderState.saving, action: EDIOrdersAction): boolean => {
    switch (action.type) {
    case PUT_ORDER:
        return true;
    case PUT_ORDER_SUCCESS:
    case PUT_ORDER_FAILED:
        return false;
    default:
        return state;
    }
}

const filterReducer = (state = initialOrderState.filter, action: EDIOrdersAction): OrderFilter => {
    const {type, payload} = action;
    switch (type) {
    case FILTER_ORDERS:
        return {
            ...state,
            ...payload?.filter,
        }
    default:
        return state;
    }
}

const listReducer = (state = initialOrderState.list, action: EDIOrdersAction): EDIOrder[] => {
    const {type, payload} = action;
    switch (type) {
    case FETCH_ORDERS_SUCCESS:
        return [...payload?.list || []];
    default:
        return state;
    }
}

export default combineReducers({
    loading: loadingReducer,
    saving: savingReducer,
    filter: filterReducer,
    list: listReducer,
});

