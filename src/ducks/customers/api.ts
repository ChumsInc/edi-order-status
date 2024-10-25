import {Customer} from "./index";
import {fetchJSON} from "chums-components";

const URL_CUSTOMERS = '/api/operations/shipping/edi-order-status/chums/customers';

export async function fetchCustomers():Promise<Customer[]> {
    try {
        const res = await fetchJSON<{customers:Customer[]}>(URL_CUSTOMERS);
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
