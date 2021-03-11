import {Action} from 'redux';
import {ThunkAction} from 'redux-thunk';

import {EDIOrder, EDIOrdersAction, OrderFilter, OrderStatusUpdate, StatusPopupKey} from "./types";
import {onErrorAction} from "../alerts";
import {GetStateFunction, RootState} from "../index";
import {customerKey} from "./utils";
import * as QueryString from "querystring";

export const ordersFetch: string = 'app/orders/fetch';
export const ordersFetchSuccess: string = 'app/orders/fetch/success';
export const ordersFetchFailure: string = 'app/orders/fetch/failure';

export const ordersPut: string = 'app/orders/put';
export const ordersPutSuccess: string = 'app/orders/put/success';
export const ordersPutFailure: string = 'app/orders/put/failure';

export const ordersComment: string = 'app/orders/comment';
export const ordersCommentSuccess: string = 'app/orders/comment/success';
export const ordersCommentFailure: string = 'app/orders/comment/failure';

export const ordersSortChanged:string = 'app/orders/sortChanged';

export const ordersFilterChanged: string = 'app/orders/filterChanged';

export const ordersToggleStatusPopup: string = 'app/orders/toggleStatusPopup';

export const setOrderSelected: string = 'app/orders/setOrderSelected';


const API_URL_ORDERS = '/api/operations/shipping/edi-order-status/chums/';
const API_URL_ORDERS_COMPLETED = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/';
const API_URL_ORDER_STATUS = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/:CustomerPONo/:statusCode';
const API_URL_ORDER_NOTES = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/:CustomerPONo/notes';



function completedURL(filter:OrderFilter) {
    const url = API_URL_ORDERS_COMPLETED
        .replace(':ARDivisionNo', encodeURIComponent(filter.ARDivisionNo || ''))
        .replace(':CustomerNo', encodeURIComponent(filter.CustomerNo || ''));
    const query = new URLSearchParams();
    query.append('completed', '1');
    if (filter.minDate) {
        query.append('minDate', filter.minDate);
    }
    if (filter.maxDate) {
        query.append('maxDate', filter.maxDate);
    }
    return `${url}?${query.toString()}`;
}

export const fetchOrdersAction = ():ThunkAction<void, {}, unknown, Action<string>> => async (dispatch, getState) => {
    try {

        // @ts-ignore
        const {orders} = getState();
        if (orders.loading) {
            return;
        }

        const url = orders.filter.showCompleted
            ? completedURL(orders.filter)
            : API_URL_ORDERS;
        dispatch({type: ordersFetch});
        const res = await fetch(url, {cache: 'no-cache', credentials: 'same-origin'});
        const json = await res.json();
        const {salesOrders, error} = json;
        if (error) {
            dispatch(onErrorAction(new Error(error), ordersFetch));
            dispatch({type: ordersFetchFailure});
        }
        dispatch({type: ordersFetchSuccess, payload: {list: salesOrders}});
    } catch(err) {
        console.log("()", err.message);
        dispatch(onErrorAction(err, ordersFetch));
        dispatch({type: ordersFetchFailure});
    }
}

export const onChangeFilter = (props:OrderFilter):EDIOrdersAction => ({type: ordersFilterChanged, payload: {filter: {...props}}});

export const onChangeOrderStatus = (order:EDIOrder, newStatus: OrderStatusUpdate, ):ThunkAction<void, RootState, null, Action<string>> =>
    async (dispatch) => {
    try {
        dispatch({type: ordersPut});
        const url = API_URL_ORDER_STATUS
            .replace(':ARDivisionNo', encodeURIComponent(order.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(order.CustomerNo))
            .replace(':CustomerPONo', encodeURIComponent(order.CustomerPONo))
            .replace(':statusCode', encodeURIComponent(newStatus.key));
        const res = await fetch(url, {
            credentials: 'same-origin', method: 'PUT', body: JSON.stringify(newStatus),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        const json = await res.json();
        const {salesOrder} = json;
        if (salesOrder) {
            dispatch({type: ordersPutSuccess, payload: {salesOrder}});
        }
    } catch(err) {
        console.log("onChangeOrderStatus()", err.message);
        dispatch(onErrorAction(err, ordersPut));
        dispatch({type: ordersPutFailure});
    }
}

export const onChangeOrderComment = (order: EDIOrder, notes:string):ThunkAction<void, RootState, null, Action<string>> =>
    async (dispatch) => {
        try {
            dispatch({type: ordersComment, payload: {salesOrder: {...order, notes}}});
            const url = API_URL_ORDER_NOTES
                .replace(':ARDivisionNo', encodeURIComponent(order.ARDivisionNo))
                .replace(':CustomerNo', encodeURIComponent(order.CustomerNo))
                .replace(':CustomerPONo', encodeURIComponent(order.CustomerPONo));
            const res = await fetch(url, {
                credentials: 'same-origin', method: 'PUT', body: JSON.stringify({notes}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const json = await res.json();
            const {salesOrder} = json;
            if (salesOrder) {
                dispatch({type: ordersCommentSuccess, payload: {salesOrder}});
            }
        } catch(err) {
            console.log("onChangeOrderComment()", err.message);
            dispatch(onErrorAction(err, ordersComment));
            dispatch({type: ordersCommentFailure});
        }
}

export const toggleStatusPopup = (statusPopupKey: StatusPopupKey) => ({type: ordersToggleStatusPopup, payload: {statusPopupKey}});

export const statusPopupEquality = (a: StatusPopupKey, b:StatusPopupKey) => Object.values(a).join('/') === Object.values(b).join('/');

export const setSortField = (field:string) => ({type: ordersSortChanged, payload: {field}});

export const selectOrders = (selectedList:string[], selected:boolean):EDIOrdersAction => ({type: setOrderSelected, payload: {selectedList, selected}});
