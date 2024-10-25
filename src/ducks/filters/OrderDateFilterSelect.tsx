import React, {ChangeEvent, useId} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectOrderDates} from "../orders/selectors";
import {setOrderDate, selectOrderDateFilter} from "./index";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";


const OrderDateFilterSelect = () => {
    const dispatch = useDispatch();
    const orderDates = useSelector(selectOrderDates);
    const value = useSelector(selectOrderDateFilter);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setOrderDate(ev.target.value));
    }

    return (
        <>
            <FormLabel htmlFor={id} column={false}>Order Date</FormLabel>
            <FormSelect size="sm" onChange={changeHandler} value={value} id={id}>
                <option value="">All</option>
                <option value="" disabled/>
                {orderDates.map(date => (
                    <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>))}
            </FormSelect>
        </>
    )
}

export default OrderDateFilterSelect;
