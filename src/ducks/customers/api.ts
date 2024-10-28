import {fetchJSON} from "chums-components";
import {EDICustomer} from "chums-types";

export async function fetchCustomers():Promise<EDICustomer[]> {
    try {
        const url = '/api/operations/shipping/edi-order-status/customers.json';
        const res = await fetchJSON<{customers:EDICustomer[]}>(url);
        return res?.customers ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadCustomers()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadCustomers()", err);
        return Promise.reject(new Error('Error in loadCustomers()'));
    }
}
