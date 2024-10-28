import {FetchOrdersArg, FetchOrdersResponse, PutOrderCommentArg, PutOrderStatusArg} from "./types";
import {fetchJSON} from "chums-components";
import {EDIOrder} from "chums-types";

const urlCustomerOrders = '/api/operations/shipping/edi-order-status/:ARDivisionNo-:CustomerNo/orders.json';
const urlAllOrders = '/api/operations/shipping/edi-order-status/orders.json';
const urlSetStatus = '/api/operations/shipping/edi-order-status/:ARDivisionNo-:CustomerNo/:status.json';
const urlSetNotes = '/api/operations/shipping/edi-order-status/:ARDivisionNo-:CustomerNo/notes.json';


function ordersURL({ARDivisionNo, CustomerNo, completed, minDate, maxDate}: FetchOrdersArg): string {
    const url = (!!ARDivisionNo && !!CustomerNo)
        ? urlCustomerOrders
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo))
        : urlAllOrders;
    const query = new URLSearchParams();
    if (completed) {
        query.append('completed', '1');
    }
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
        const url = ordersURL(arg);
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
        const url = urlSetStatus
            .replace(':ARDivisionNo', encodeURIComponent(arg.salesOrder.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(arg.salesOrder.CustomerNo))
            .replace(':status', encodeURIComponent(arg.status.statusCode))
        const body = JSON.stringify({CustomerPONo: arg.salesOrder.CustomerPONo, ...arg.status});
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
        const url = urlSetNotes
            .replace(':ARDivisionNo', encodeURIComponent(arg.salesOrder.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(arg.salesOrder.CustomerNo));
        const body = JSON.stringify({CustomerPONo: arg.salesOrder.CustomerPONo, notes: arg.comment});
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

