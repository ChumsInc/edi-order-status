import React, {ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectOrderDates} from "../orders/selectors";
import {orderDateChangedAction, selectOrderDateFilter} from "./index";


const OrderDateFilterSelect: React.FC = () => {
    const dispatch = useDispatch();
    const orderDates = useSelector(selectOrderDates);
    const value = useSelector(selectOrderDateFilter);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(orderDateChangedAction(ev.target.value));
    }

    return (
        <>
            <label className="form-label">Order Date</label>
            <select className="form-select form-select-sm" onChange={changeHandler} value={value}>
                <option value="">All</option>
                <option value="" disabled/>
                {orderDates.map(date => (
                    <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>))}
            </select>
        </>
    )
}

export default OrderDateFilterSelect;
