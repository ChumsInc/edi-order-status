import {Customer} from "./index";
import {customerKey} from "../orders/utils";

export const customerSorter = (a:Customer, b:Customer) => {
    return customerKey(a).toUpperCase() > customerKey(b).toUpperCase() ? 1 : -1;
}

export const customerNameSorter = (a:Customer, b:Customer) => {
    return a.CustomerName.toLowerCase() === b.CustomerName.toLowerCase()
        ? customerSorter(a, b)
        : (a.CustomerName.toLowerCase() > b.CustomerName.toLowerCase() ? 1 : -1)
}
