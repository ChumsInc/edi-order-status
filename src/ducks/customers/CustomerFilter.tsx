import React, {ChangeEvent, useEffect} from "react";
import {useSelector} from "react-redux";
import {customerKey} from "../orders/utils";
import {loadCustomers, selectCustomerList, selectCustomersLoaded} from "./index";
import {selectCustomerFilter, selectMapadocFilter, setCustomer} from "../filters";
import {useAppDispatch} from "../../app/hooks";
import {useSearchParams} from "react-router-dom";
import {loadOrders} from "../orders/actions";

interface Props {
    required?: boolean
}

const CustomerFilterSelect: React.FC<Props> = ({required}) => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const customers = useSelector(selectCustomerList);
    const loaded = useSelector(selectCustomersLoaded);
    const selected = useSelector(selectCustomerFilter);
    const mapadoc = useSelector(selectMapadocFilter);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadCustomers());
        }
    }, []);


    useEffect(() => {
        if (!loaded || !selected) {
            return;
        }
        const filteredCustomers = customers.filter(c => !mapadoc || c.isMAPADOC).map(c => customerKey(c));
        if (!filteredCustomers.includes(customerKey(selected))) {
            const params = new URLSearchParams(window.location.search);
            params.delete('customer');
            setSearchParams(params);
            dispatch(setCustomer(null));
            dispatch(loadOrders())
        }
    }, [mapadoc, loaded]);

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
        dispatch(setCustomer(customer));
        if (selected) {
            dispatch(loadOrders());
        }
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
