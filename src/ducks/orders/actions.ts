import {Action} from 'redux';
import {ThunkAction} from 'redux-thunk';

import {Customer, EDIOrder, EDIOrdersAction, OrderFilter, OrderStatusUpdate, StatusPopupKey} from "./types";
import {onErrorAction} from "../alerts";
import {RootState} from "../index";
import {customerKey} from "./utils";

export const FETCH_ORDERS: string = 'app/orders/fetch';
export const FETCH_ORDERS_SUCCESS: string = 'app/orders/fetch/success';
export const FETCH_ORDERS_FAILED: string = 'app/orders/fetch/failure';

export const PUT_ORDER: string = 'app/orders/put';
export const PUT_ORDER_SUCCESS: string = 'app/orders/put/success';
export const PUT_ORDER_FAILED: string = 'app/orders/put/failure';

export const SET_STATUS: string = 'app/orders/statusChanged';
export const RECEIVE_STATUS: string = 'app/orders/statusReceived';
export const FILTER_ORDERS: string = 'app/orders/filterChanged';

export const TOGGLE_STATUS_POPUP: string = 'app/orders/toggleStatusPopup';


const API_URL_ORDERS = '/api/operations/shipping/edi-order-status/chums/';
const API_URL_ORDER_STATUS = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/:CustomerPONo/:statusCode';
const API_URL_ORDER_NOTES = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/:CustomerPONo/notes';


export const fetchOrdersAction = ():ThunkAction<void, {}, unknown, Action<string>> => async (dispatch, getState) => {
    try {
        dispatch({type: FETCH_ORDERS});
        const res = await fetch(API_URL_ORDERS, {cache: 'no-cache', credentials: 'same-origin'});
        const json = await res.json();
        const {salesOrders, error} = json;
        if (error) {
            dispatch(onErrorAction(new Error(error), FETCH_ORDERS));
            dispatch({type: FETCH_ORDERS_FAILED});
        }
        dispatch({type: FETCH_ORDERS_SUCCESS, payload: {list: salesOrders}});
    } catch(err) {
        console.log("()", err.message);
        dispatch(onErrorAction(err, FETCH_ORDERS));
        dispatch({type: FETCH_ORDERS_FAILED});
    }
}

export const onChangeFilter = (props:OrderFilter):EDIOrdersAction => ({type: FILTER_ORDERS, payload: {filter: {...props}}});

export function uniqueCustomerSelector(state: RootState):Customer[] {
    const customers:{[key:string]: Customer} = {};
    state.orders.list.forEach(order => {
        const key = customerKey(order);
        if (!customers[key]) {
            const {ARDivisionNo, CustomerNo, BillToName} = order;
            customers[key] = {ARDivisionNo, CustomerNo, BillToName};
        }
    })
    return Object.values(customers);
}

export const customerEquality = (a:Customer[], b:Customer[]) => {
    if (a.length !== b.length) {
        return false;
    }
    return a.map(_a => customerKey(_a)).join('/') === b.map(_b => customerKey(_b)).join('/');
}

export const onChangeOrderStatus = (order:EDIOrder, newStatus: OrderStatusUpdate, ):ThunkAction<void, RootState, null, Action<string>> =>
    async (dispatch, getState) => {
    try {
        dispatch({type: PUT_ORDER});
        const url = API_URL_ORDER_STATUS
            .replace(':ARDivisionNo', encodeURIComponent(order.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(order.CustomerNo))
            .replace(':CustomerPONo', encodeURIComponent(order.CustomerPONo))
            .replace(':statusCode', encodeURIComponent(newStatus.key));
        const res = await fetch(url, {
            credentials: 'same-origin', method: 'POST', body: JSON.stringify(newStatus),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        const json = await res.json();
        const {salesOrder} = json;
        if (salesOrder) {
            dispatch({type: PUT_ORDER_SUCCESS, payload: {salesOrder}});
        }
    } catch(err) {
        console.log("onChangeOrderStatus()", err.message);
        dispatch(onErrorAction(err, PUT_ORDER));
        dispatch({type: PUT_ORDER_FAILED});
    }
}

export const onChangeOrderComment = (order: EDIOrder, notes:string):ThunkAction<void, RootState, null, Action<string>> =>
    async (dispatch, getState) => {
        try {
            dispatch({type: PUT_ORDER});
            const url = API_URL_ORDER_NOTES
                .replace(':ARDivisionNo', encodeURIComponent(order.ARDivisionNo))
                .replace(':CustomerNo', encodeURIComponent(order.CustomerNo))
                .replace(':CustomerPONo', encodeURIComponent(order.CustomerPONo));
            const res = await fetch(url, {
                credentials: 'same-origin', method: 'POST', body: JSON.stringify({notes}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const json = await res.json();
            const {salesOrder} = json;
            if (salesOrder) {
                dispatch({type: PUT_ORDER_SUCCESS, payload: {salesOrder}});
            }
        } catch(err) {
            console.log("onChangeOrderComment()", err.message);
            dispatch(onErrorAction(err, PUT_ORDER));
            dispatch({type: PUT_ORDER_FAILED});
        }
}

export const toggleStatusPopup = (statusPopupKey: StatusPopupKey) => ({type: TOGGLE_STATUS_POPUP, payload: {statusPopupKey}});

export const statusPopupEquality = (a: StatusPopupKey, b:StatusPopupKey) => Object.values(a).join('/') === Object.values(b).join('/');

