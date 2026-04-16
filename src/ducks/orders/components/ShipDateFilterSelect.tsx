import {type ChangeEvent, useId} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectShipDate, selectShipDates, setShipDate} from "../ordersSlice.ts";

import FormLabel from 'react-bootstrap/FormLabel'
import FormSelect from 'react-bootstrap/FormSelect'
import {useEdiOrdersForm} from "@/hooks/edi-orders-form/useEdiOrdersForm.ts";
import dayjs from "dayjs";

const ShipDateFilterSelect = () => {
    const dispatch = useDispatch();
    const shipDates = useSelector(selectShipDates);
    const value = useSelector(selectShipDate);
    const {completed} = useEdiOrdersForm();
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setShipDate(ev.target.value));
    }

    return (
        <div>
            <FormLabel htmlFor={id} column={false}>Ship Date</FormLabel>
            <FormSelect size="sm" onChange={changeHandler} value={value ?? ''} id={id}>
                <option value="">All</option>
                <option value="" disabled/>
                {completed && (<option value="closed">Closed Orders</option>)}
                {shipDates.map(date => (
                    <option key={date} value={date}>{dayjs(date).format('MM/DD/YYYY')}</option>))}
            </FormSelect>
        </div>
    )
}

export default ShipDateFilterSelect;
