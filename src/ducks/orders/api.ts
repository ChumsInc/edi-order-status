import {EDIOrder, FetchOrdersArg, FetchOrdersResponse, PutOrderCommentArg, PutOrderStatusArg} from "./types";
import {fetchJSON} from "chums-components";

const API_URL_ORDERS = (arg: FetchOrdersArg) => '/api/operations/shipping/edi-order-status/chums/' + (arg.ARDivisionNo ? `${arg.ARDivisionNo}-${arg.CustomerNo}` : '');
const API_URL_ORDERS_COMPLETED = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/';
const API_URL_ORDER_STATUS = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/:CustomerPONo/:statusCode';
const API_URL_ORDER_NOTES = '/api/operations/shipping/edi-order-status/chums/:ARDivisionNo/:CustomerNo/:CustomerPONo/notes';

function completedURL({ARDivisionNo, CustomerNo, minDate, maxDate}: FetchOrdersArg) {
    const url = API_URL_ORDERS_COMPLETED
        .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo!))
        .replace(':CustomerNo', encodeURIComponent(CustomerNo!));
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

export async function fetchOrders(arg: FetchOrdersArg): Promise<EDIOrder[]> {
    try {
        const url = arg.completed
            ? completedURL(arg)
            : API_URL_ORDERS(arg);
        const res = await fetchJSON<FetchOrdersResponse>(url)
        return res?.salesOrders ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOrders()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOrders()", err);
        return Promise.reject(new Error('Error in fetchOrders()'));
    }
}

export async function putOrderStatus(arg: PutOrderStatusArg): Promise<EDIOrder | null> {
    try {
        const url = API_URL_ORDER_STATUS
            .replace(':ARDivisionNo', encodeURIComponent(arg.salesOrder.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(arg.salesOrder.CustomerNo))
            .replace(':CustomerPONo', encodeURIComponent(arg.salesOrder.CustomerPONo))
            .replace(':statusCode', encodeURIComponent(arg.statusCode.key));
        const body = JSON.stringify(arg.statusCode);
        const res = await fetchJSON<{ salesOrder: EDIOrder }>(url, {method: 'PUT', body});
        return res?.salesOrder ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("putOrderStatus()", err.message);
            return Promise.reject(err);
        }
        console.debug("putOrderStatus()", err);
        return Promise.reject(new Error('Error in putOrderStatus()'));
    }
}

export async function putOrderComment(arg: PutOrderCommentArg): Promise<EDIOrder | null> {
    try {
        const url = API_URL_ORDER_NOTES
            .replace(':ARDivisionNo', encodeURIComponent(arg.salesOrder.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(arg.salesOrder.CustomerNo))
            .replace(':CustomerPONo', encodeURIComponent(arg.salesOrder.CustomerPONo));
        const body = JSON.stringify({notes: arg.comment});
        const res = await fetchJSON<{ salesOrder: EDIOrder }>(url, {method: 'PUT', body});
        return res?.salesOrder ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("putOrderComment()", err.message);
            return Promise.reject(err);
        }
        console.debug("putOrderComment()", err);
        return Promise.reject(new Error('Error in putOrderComment()'));
    }
}
