import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {customerKey} from "../ducks/orders/utils";
import {Customer} from "../ducks/customers";
import {RootState} from "../ducks";

interface Props {
    onChange: (customer: Customer) => void,
    required?: boolean
}

const CustomerFilterSelect: React.FC<Props> = ({onChange, required}) => {
    const customers = useSelector((state: RootState) => state.customers.list);
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const key = ev.target.value;
        const [customer] = customers.filter(customer => customerKey(customer) === key);
        onChange(customer || {});
    }
    return (
        <select className="form-select form-select-sm" onChange={changeHandler} required={required}>
            <option value="">All Customers</option>
            {customers.map(customer => (
                <option key={customerKey(customer)} value={customerKey(customer)}>{customer.CustomerName} - {customerKey(customer)}</option>))}
        </select>
    )
}

export default CustomerFilterSelect;
