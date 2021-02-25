import React, {ChangeEvent} from "react";
import {useSelector, shallowEqual} from "react-redux";
import {customerEquality, uniqueCustomerSelector} from "../ducks/orders/actions";
import {customerKey} from "../ducks/orders/utils";
import {Customer} from "../ducks/orders/types";

interface Props {
    onChange: (customer:Customer) => void,
}

const CustomerFilterSelect:React.FC<Props> = ({onChange}) => {
    const customers = useSelector(uniqueCustomerSelector, customerEquality);
    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        const key = ev.target.value;
        const [customer] = customers.filter(customer => customerKey(customer) === key);
        onChange(customer || {});
    }
    return (
        <select className="form-select form-select-sm" onChange={changeHandler}>
            <option value="">All Customers</option>
            {customers.map(customer => (<option key={customerKey(customer)} value={customerKey(customer)}>{customer.BillToName}</option>))}
        </select>
    )
}

export default CustomerFilterSelect;
