import {Customer} from "./index";
import {customerKey} from "../orders/utils";

export const customerSorter = (a:Customer, b:Customer) => {
    return customerKey(a).toUpperCase() > customerKey(b).toUpperCase() ? 1 : -1;
}
