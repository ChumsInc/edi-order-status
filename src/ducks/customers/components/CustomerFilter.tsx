import {type ChangeEvent} from "react";
import {customerKey, orderFormElements} from "../../orders/utils.ts";
import {selectCurrentCustomer, selectFilteredCustomerList, selectShowMAPADOCOnly} from "../customersSlice.ts";
import {useSearchParams} from "react-router";
import {customerNameSorter} from "../utils.ts";
import FormSelect from "react-bootstrap/FormSelect";
import {useAppSelector} from "@/app/configureStore.ts";

interface CustomerFilterSelectProps {
    required?: boolean
}

const CustomerFilterSelect = ({required}: CustomerFilterSelectProps) => {
    const [, setSearchParams] = useSearchParams();
    const customers = useAppSelector(selectFilteredCustomerList);
    const currentCustomer = useAppSelector(selectCurrentCustomer);
    const onlyMAPADOC = useAppSelector(selectShowMAPADOCOnly);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const key = ev.target.value;
        const [customer = null] = customers.filter(customer => customerKey(customer) === key);
        const params = new URLSearchParams(window.location.search);
        if (!customer) {
            params.delete('customer');
        } else {
            params.set('customer', key);
        }
        setSearchParams(params);
        // dispatch(setCurrentCustomer(key));
    }

    return (
        <FormSelect size="sm" name={orderFormElements.customer}
                    value={currentCustomer ?? ''}
                    onChange={changeHandler} required={required}>
            <option value="">All Customers</option>
            <option disabled>-</option>
            {customers
                .filter(customer => !onlyMAPADOC || customer.isMAPADOC)
                .sort(customerNameSorter)
                .map(customer => (
                    <option key={customerKey(customer)}
                            value={customerKey(customer)}>{customer.CustomerName} - {customerKey(customer)}</option>))}
        </FormSelect>
    )
}

export default CustomerFilterSelect;
