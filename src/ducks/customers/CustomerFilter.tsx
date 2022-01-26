import React, {ChangeEvent, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {customerKey} from "../orders/utils";
import {fetchCustomers, selectCustomerList, selectCustomersLoaded} from "./index";
import {customerChangedAction, selectCustomerFilter, selectMapadocFilter} from "../filters";

interface Props {
    required?: boolean
}

const CustomerFilterSelect: React.FC<Props> = ({required}) => {
    const dispatch = useDispatch();
    const customers = useSelector(selectCustomerList);
    const loaded = useSelector(selectCustomersLoaded);
    const selected = useSelector(selectCustomerFilter);
    const mapadoc = useSelector(selectMapadocFilter);

    useEffect(() => {
        if (!loaded) {
            dispatch(fetchCustomers());
        }
    }, [])

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const key = ev.target.value;
        const [customer = null] = customers.filter(customer => customerKey(customer) === key);
        dispatch(customerChangedAction(customer));
    }
    return (
        <select className="form-select form-select-sm"
                value={!!selected ? customerKey(selected) : ''}
                onChange={changeHandler} required={required}>
            <option value="">All Customers</option>
            <option disabled>-</option>
            {customers
                .filter(customer => !mapadoc || customer.isMAPADOC)
                .map(customer => (
                    <option key={customerKey(customer)}
                            value={customerKey(customer)}>{customer.CustomerName} - {customerKey(customer)}</option>))}
        </select>
    )
}

export default CustomerFilterSelect;
