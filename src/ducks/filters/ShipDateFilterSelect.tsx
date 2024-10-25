import React, {ChangeEvent, useId} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectShipDates} from "../orders/selectors";
import {selectShipDateFilter, selectShowCompletedFilter, setShipDate} from "./index";
import FormLabel from 'react-bootstrap/FormLabel'
import FormSelect from 'react-bootstrap/FormSelect'

const ShipDateFilterSelect = () => {
    const dispatch = useDispatch();
    const shipDates = useSelector(selectShipDates);
    const value = useSelector(selectShipDateFilter);
    const showCompleted = useSelector(selectShowCompletedFilter);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setShipDate(ev.target.value));
    }

    return (
        <div>
            <FormLabel htmlFor={id} column={false}>Ship Date</FormLabel>
            <FormSelect size="sm" onChange={changeHandler} value={value} id={id}>
                <option value="">All</option>
                <option value="" disabled/>
                {showCompleted && (<option value="closed">Closed Orders</option>)}
                {shipDates.map(date => (
                    <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>))}
            </FormSelect>
        </div>
    )
}

export default ShipDateFilterSelect;
