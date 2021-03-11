import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../index";

const orderDateSelector = (state:RootState):string[] => {
    const dates:{[key:string]:string} = {};
    const {ARDivisionNo, CustomerNo} = state.orders.filter;
    state.orders.list
        .filter(order => !ARDivisionNo || !CustomerNo || (order.ARDivisionNo === ARDivisionNo && order.CustomerNo === CustomerNo))
        .forEach(order => dates[order.OrderDate] = order.OrderDate);
    return Object.values(dates).sort();
}

interface Props {
    onChange: (orderDate: string) => void,
    value: string;
}

const OrderDateFilterSelect: React.FC<Props> = ({onChange, value}) => {
    const orderDates = useSelector(orderDateSelector);
    if (orderDates.length === 0) {
        return null;
    }
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        onChange(ev.target.value);
    }

    return (
        <div className="form-floating">
            <select className="form-select form-select-sm" onChange={changeHandler} value={value || ''}>
                <option value="">All</option>
                <option value="" disabled />
                {orderDates.map(date => (
                    <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>))}
            </select>
            <label>Order Date</label>
        </div>
    )
}

export default OrderDateFilterSelect;
