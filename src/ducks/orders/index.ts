import {combineReducers} from 'redux';
import {EDIOrder, EDIOrdersAction, OrderFilter, StatusPopupKey} from "./types";
import {
    ordersComment,
    ordersCommentSuccess,
    ordersFetch,
    ordersFetchFailure,
    ordersFetchSuccess,
    ordersFilterChanged,
    ordersPut,
    ordersPutFailure,
    ordersPutSuccess,
    ordersSortChanged,
    ordersToggleStatusPopup, setAutoRefresh,
    setOrderSelected
} from "./actions";
import {orderKey} from "./utils";
import {initialOrderState, noSelectedPopup} from './defaults';
import {sortFunctions} from "./EDIOrderSorter";
import {STORAGE_KEYS, appStorage} from '../../appStorage';

const loadingReducer = (state = initialOrderState.loading, action: EDIOrdersAction): boolean => {
    switch (action.type) {
    case ordersFetch:
        return true;
    case ordersFetchSuccess:
    case ordersFetchFailure:
        return false;
    default:
        return state;
    }
}

const savingReducer = (state = initialOrderState.saving, action: EDIOrdersAction): boolean => {
    switch (action.type) {
    case ordersPut:
        return true;
    case ordersPutSuccess:
    case ordersPutFailure:
        return false;
    default:
        return state;
    }
}

const filterReducer = (state = initialOrderState.filter, action: EDIOrdersAction): OrderFilter => {
    const {type, payload} = action;
    switch (type) {
    case ordersFilterChanged:
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
    case ordersFetchSuccess:
        return [...payload?.list || []].sort(sortFunctions.CustomerNo);
    case ordersComment:
    case ordersCommentSuccess:
    case ordersPutSuccess:
        if (!payload?.salesOrder) {
            return state;
        }
        const payloadOrderKey = orderKey(payload.salesOrder);
        return [
            ...state.filter(order => orderKey(order) !== payloadOrderKey),
            {...payload.salesOrder}
        ].sort(sortFunctions.CustomerNo);
    case setOrderSelected:
        return [
            ...state
                .filter(order => payload?.selectedList?.indexOf(orderKey(order)) !== -1)
                .map(order => {
                    order.selected = payload?.selected || false;
                    return order;
                }),
            ...state.filter(order => payload?.selectedList?.indexOf(orderKey(order)) === -1)
        ].sort(sortFunctions.CustomerNo)
    default:
        return state;
    }
}

const statusPopupReducer = (state: StatusPopupKey = noSelectedPopup, action: EDIOrdersAction):StatusPopupKey => {
    const {type, payload} = action;
    switch (type) {
    case ordersToggleStatusPopup: {
        if (payload?.statusPopupKey?.key === state.key && payload?.statusPopupKey?.statusField === state.statusField) {
            return {...noSelectedPopup};
        }
        return {...(payload?.statusPopupKey || noSelectedPopup)};
    }
    case ordersPutSuccess:
        return {...noSelectedPopup}
    default:
        return state;
    }
}

const sortReducer = (state = initialOrderState.sort, action: EDIOrdersAction) => {
    const {type, payload} = action;
    const field = payload?.field || initialOrderState.sort.field;
    switch (type) {
    case ordersSortChanged:
        if (state.field === field) {
            return {...state, asc: !state.asc};
        }
        return {field, asc: true};
    default:
        return state;
    }
}

const autoRefreshReducer = (state:boolean = initialOrderState.autoRefresh, action: EDIOrdersAction):boolean => {
    const {type} = action;
    switch (type) {
    case setAutoRefresh:
        appStorage.setItem(STORAGE_KEYS.AUTO_REFRESH, !state);
        return !state;
    default: return state;
    }
}

export default combineReducers({
    loading: loadingReducer,
    saving: savingReducer,
    filter: filterReducer,
    list: listReducer,
    statusPopup: statusPopupReducer,
    sort: sortReducer,
    autoRefresh: autoRefreshReducer,
});
