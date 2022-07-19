import {EDIOrder, EDIOrdersAction, EDIOrdersThunkAction, OrderFilter, OrderStatusUpdate, StatusPopupKey} from "./types";
import {selectOrdersLoading} from "./selectors";
import {fetchJSON} from "chums-components";
import {
    FilterCustomer,
    selectCustomerFilter,
    selectMaxDateFilter,
    selectMinDateFilter,
    selectShowCompletedFilter
} from "../filters";
import Timeout = NodeJS.Timeout;

export const ordersFetch: string = 'app/orders/fetch';
export const ordersFetchSuccess: string = 'app/orders/fetch/success';
export const ordersFetchFailure: string = 'app/orders/fetch/failure';

export const ordersPut: string = 'app/orders/put';
export const ordersPutSuccess: string = 'app/orders/put/success';
export const ordersPutFailure: string = 'app/orders/put/failure';

export const ordersComment: string = 'app/orders/comment';
export const ordersCommentSuccess: string = 'app/orders/comment/success';
export const ordersCommentFailure: string = 'app/orders/comment/failure';

export const ordersSortChanged: string = 'app/orders/sortChanged';
export const ordersFilterChanged: string = 'app/orders/filterChanged';
export const ordersToggleStatusPopup: string = 'app/orders/toggleStatusPopupAction';
export const setOrderSelected: string = 'app/orders/setOrderSelected';
export const setAutoRefresh: string = 'app/orders/setAutoRefresh';

let refreshTimer: Timeout | number;
const REFRESH_TIMER_MS = 10 * 60 * 1000;

const API_URL_ORDERS = (customer: FilterCustomer | null) => '/api/operations/shipping/edi-order-status/chums/' + (customer ? `${customer.ARDivisionNo}-${customer.CustomerNo}` : '');
const API_URL_ORDERS_COMPLETED = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/';
const API_URL_ORDER_STATUS = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/:CustomerPONo/:statusCode';
const API_URL_ORDER_NOTES = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/:CustomerPONo/notes';


export interface CompletedURLProps {
    customer: FilterCustomer | null,
    minDate: string,
    maxDate: string,
}

function completedURL({customer, minDate, maxDate}: CompletedURLProps) {
    const url = API_URL_ORDERS_COMPLETED
        .replace(':ARDivisionNo', encodeURIComponent(customer?.ARDivisionNo || ''))
        .replace(':CustomerNo', encodeURIComponent(customer?.CustomerNo || ''));
    const query = new URLSearchParams();
    query.append('completed', '1');
    if (minDate) {
        query.append('minDate', minDate);
    }
    if (maxDate) {
        query.append('maxDate', maxDate);
    }
    return `${url}?${query.toString()}`;
}

export const fetchOrdersAction = (): EDIOrdersThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectOrdersLoading(state)) {
                return;
            }

            const customer = selectCustomerFilter(state);
            const minDate = selectMinDateFilter(state);
            const maxDate = selectMaxDateFilter(state);
            const showCompleted = selectShowCompletedFilter(state);

            const url = showCompleted
                ? completedURL({customer, minDate, maxDate})
                : API_URL_ORDERS(customer);
            dispatch({type: ordersFetch});
            const {salesOrders, error} = await fetchJSON(url);
            if (error) {
                return dispatch({
                    type: ordersFetchSuccess,
                    payload: {list: salesOrders, error: new Error(error), context: ordersFetch}
                });
            }
            dispatch({type: ordersFetchSuccess, payload: {list: salesOrders}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchOrdersAction()", error.message);
                return dispatch({type: ordersFetchFailure, payload: {error, context: ordersFetch}})
            }
            console.error("fetchOrdersAction()", error);
        }
    }

export const onChangeFilterAction = (props: OrderFilter): EDIOrdersAction => ({
    type: ordersFilterChanged,
    payload: {filter: {...props}}
});

export const onChangeOrderStatusAction = (order: EDIOrder, newStatus: OrderStatusUpdate,): EDIOrdersThunkAction =>
    async (dispatch) => {
        try {
            dispatch({type: ordersPut});
            const url = API_URL_ORDER_STATUS
                .replace(':ARDivisionNo', encodeURIComponent(order.ARDivisionNo))
                .replace(':CustomerNo', encodeURIComponent(order.CustomerNo))
                .replace(':CustomerPONo', encodeURIComponent(order.CustomerPONo))
                .replace(':statusCode', encodeURIComponent(newStatus.key));
            const {salesOrder} = await fetchJSON(url, {method: 'PUT', body: JSON.stringify(newStatus)});
            if (salesOrder) {
                dispatch({type: ordersPutSuccess, payload: {salesOrder}});
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("onChangeOrderStatusAction()", err.message);
                dispatch({type: ordersPutFailure, payload: {error: err, context: ordersPutSuccess}});
            }
        }
    }

function wait(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(null), ms);
    });
}

export const onMassChangeOrderStatusAction = (newStatus: OrderStatusUpdate): EDIOrdersThunkAction =>
    async (dispatch, getState) => {
        try {
            const selectedOrders = getState().orders.list.filter(order => order.selected);
            for (const order of selectedOrders) {
                dispatch(onChangeOrderStatusAction(order, newStatus));
                await wait(100);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("onMassChangeOrderStatusAction()", err.message);
                return Promise.reject(err);
            }
            return Promise.reject(new Error('onMassChangeOrderStatusAction: Unknown error'));
        }
    }

export const onChangeOrderCommentAction = (order: EDIOrder, notes: string): EDIOrdersThunkAction =>
    async (dispatch) => {
        try {
            dispatch({type: ordersComment, payload: {salesOrder: {...order, notes}}});
            const url = API_URL_ORDER_NOTES
                .replace(':ARDivisionNo', encodeURIComponent(order.ARDivisionNo))
                .replace(':CustomerNo', encodeURIComponent(order.CustomerNo))
                .replace(':CustomerPONo', encodeURIComponent(order.CustomerPONo));
            const {salesOrder} = await fetchJSON(url, {method: 'PUT', body: JSON.stringify({notes})});
            if (salesOrder) {
                dispatch({type: ordersCommentSuccess, payload: {salesOrder}});
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("onChangeOrderCommentAction()", err.message);
                dispatch({type: ordersCommentFailure, payload: {error: err, context: ordersComment}});
            }
        }
    }

export const toggleStatusPopupAction = (statusPopupKey: StatusPopupKey) => ({
    type: ordersToggleStatusPopup,
    payload: {statusPopupKey}
});

export const statusPopupEquality = (a: StatusPopupKey, b: StatusPopupKey) => Object.values(a).join('/') === Object.values(b).join('/');

export const setSortField = (field: string) => ({type: ordersSortChanged, payload: {field}});

export const selectOrdersAction = (selectedList: string[], selected: boolean): EDIOrdersAction => ({
    type: setOrderSelected,
    payload: {selectedList, selected}
});


export const toggleAutoRefreshAction = (): EDIOrdersThunkAction =>
    (dispatch, getState) => {
        const willAutoRefresh = !getState().orders.autoRefresh;
        if (willAutoRefresh) {
            refreshTimer = setInterval(() => dispatch(fetchOrdersAction()), REFRESH_TIMER_MS);
        } else {
            clearInterval(refreshTimer as Timeout);
        }
        dispatch({type: setAutoRefresh});
    }
