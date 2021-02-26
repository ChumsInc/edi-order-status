import {combineReducers} from 'redux';
import {EDIOrder, EDIOrdersAction, OrderFilter, OrderListState, StatusPopupKey} from "./types";
import {
    ordersFetch,
    ordersFetchFailure,
    ordersFetchSuccess,
    ordersFilterChanged, ordersComment, ordersCommentSuccess,
    ordersPut,
    ordersPutFailure,
    ordersPutSuccess, ordersToggleStatusPopup
} from "./actions";
import {RootState} from "../index";
import {orderKey} from "./utils";
import {noSelectedPopup, initialOrderState, initialOrderFilter} from './defaults';

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
        return [...payload?.list || []];
    case ordersComment:
    case ordersCommentSuccess:
    case ordersPutSuccess:
        if (!payload?.salesOrder) {
            return state;
        }
        const payloadOrderKey = orderKey(payload.salesOrder);
        console.log('listReducer()', state.filter(order => orderKey(order) !== payloadOrderKey).length, state.length)
        return [
            ...state.filter(order => orderKey(order) !== payloadOrderKey),
            {...payload.salesOrder}
        ];
    default:
        return state;
    }
}

const statusPopupReducer = (state:StatusPopupKey = noSelectedPopup, action: EDIOrdersAction) => {
    const {type, payload} = action;
    switch (type) {
    case ordersToggleStatusPopup: {
        if (payload?.statusPopupKey?.key === state.key && payload?.statusPopupKey?.statusField === state.statusField) {
            return {...noSelectedPopup};
        }
        return {...payload?.statusPopupKey};
    }
    case ordersPutSuccess:
        return {...noSelectedPopup}
    default: return state;
    }
}

export default combineReducers({
    loading: loadingReducer,
    saving: savingReducer,
    filter: filterReducer,
    list: listReducer,
    statusPopup: statusPopupReducer,
});
