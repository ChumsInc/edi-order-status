import {type ChangeEvent, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {customerKey, orderFormElements} from "../../orders/utils.ts";
import {
    selectCurrentCustomer,
    selectFilteredCustomerList,
    selectShowMAPADOCOnly,
    setCurrentCustomer
} from "../customersSlice.ts";
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSearchParams} from "react-router";
import {customerNameSorter} from "../utils.ts";
import FormSelect from "react-bootstrap/FormSelect";

interface CustomerFilterSelectProps {
    required?: boolean
}

const CustomerFilterSelect = ({required}: CustomerFilterSelectProps) => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const customers = useSelector(selectFilteredCustomerList);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const onlyMAPADOC = useSelector(selectShowMAPADOCOnly);
    // const initialized = useRef<boolean>(false);

    // useEffect(() => {
    //     if (searchParams.get('customer')) {
    //         dispatch(setCurrentCustomer(searchParams.get('customer')));
    //     }
    // }, [dispatch, searchParams, initialized]);

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
