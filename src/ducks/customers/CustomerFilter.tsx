import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {customerKey} from "../orders/utils";
import {Customer} from "./index";
import {RootState} from "../index";

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
        <div className="form-floating">
            <select className="form-select form-select-sm" onChange={changeHandler} required={required}>
                <option value="">All Customers</option>
                {customers.map(customer => (
                    <option key={customerKey(customer)} value={customerKey(customer)}>{customer.CustomerName} - {customerKey(customer)}</option>))}
            </select>
            <label>Customer</label>
        </div>
    )
}

export default CustomerFilterSelect;
