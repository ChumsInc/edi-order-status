import {Action} from 'redux';
import {ThunkAction} from 'redux-thunk';

import {EDIOrdersAction, OrderFilter} from "./types";
import {onErrorAction} from "../alerts";

export const FETCH_ORDERS: string = 'app/orders/fetch';
export const FETCH_ORDERS_SUCCESS: string = 'app/orders/fetch/success';
export const FETCH_ORDERS_FAILED: string = 'app/orders/fetch/failure';

export const PUT_ORDER: string = 'app/orders/put';
export const PUT_ORDER_SUCCESS: string = 'app/orders/put/success';
export const PUT_ORDER_FAILED: string = 'app/orders/put/failure';

export const SET_STATUS: string = 'app/orders/statusChanged';
export const RECEIVE_STATUS: string = 'app/orders/statusReceived';
export const FILTER_ORDERS: string = 'app/orders/filterChanged';

const API_URL_ORDERS = 'api/operations/shipping/edi-order-status/chums/';

export const setFilterAction = (filter: OrderFilter):EDIOrdersAction => ({type: FILTER_ORDERS, payload: {filter}});

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

