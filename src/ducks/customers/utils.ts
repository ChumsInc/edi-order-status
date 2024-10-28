import {customerKey} from "../orders/utils";
import {EDICustomer} from "chums-types";

export const customerSorter = (a:EDICustomer, b:EDICustomer) => {
    return customerKey(a).toUpperCase() > customerKey(b).toUpperCase() ? 1 : -1;
}

export const customerNameSorter = (a:EDICustomer, b:EDICustomer) => {
    return a.CustomerName.toLowerCase() === b.CustomerName.toLowerCase()
        ? customerSorter(a, b)
        : (a.CustomerName.toLowerCase() > b.CustomerName.toLowerCase() ? 1 : -1)
}
