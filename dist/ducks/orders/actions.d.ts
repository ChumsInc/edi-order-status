import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { EDIOrder, EDIOrdersAction, OrderFilter, OrderStatusUpdate, StatusPopupKey } from "./types";
import { RootState } from "../index";
export declare const ordersFetch: string;
export declare const ordersFetchSuccess: string;
export declare const ordersFetchFailure: string;
export declare const ordersPut: string;
export declare const ordersPutSuccess: string;
export declare const ordersPutFailure: string;
export declare const ordersComment: string;
export declare const ordersCommentSuccess: string;
export declare const ordersCommentFailure: string;
export declare const ordersSortChanged: string;
export declare const ordersFilterChanged: string;
export declare const ordersToggleStatusPopup: string;
export declare const fetchOrdersAction: () => ThunkAction<void, {}, unknown, Action<string>>;
export declare const onChangeFilter: (props: OrderFilter) => EDIOrdersAction;
export declare const onChangeOrderStatus: (order: EDIOrder, newStatus: OrderStatusUpdate) => ThunkAction<void, RootState, null, Action<string>>;
export declare const onChangeOrderComment: (order: EDIOrder, notes: string) => ThunkAction<void, RootState, null, Action<string>>;
export declare const toggleStatusPopup: (statusPopupKey: StatusPopupKey) => {
    type: string;
    payload: {
        statusPopupKey: StatusPopupKey;
    };
};
export declare const statusPopupEquality: (a: StatusPopupKey, b: StatusPopupKey) => boolean;
export declare const setSortField: (field: string) => {
    type: string;
    payload: {
        field: string;
    };
};
