import {type ChangeEvent, useId} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectOrderDate, selectOrderDates, setOrderDate} from "../ordersSlice.ts";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";
import dayjs from "dayjs";


const OrderDateFilterSelect = () => {
    const dispatch = useDispatch();
    const orderDates = useSelector(selectOrderDates);
    const value = useSelector(selectOrderDate);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setOrderDate(ev.target.value));
    }

    return (
        <>
            <FormLabel htmlFor={id} column={false}>Order Date</FormLabel>
            <FormSelect size="sm" onChange={changeHandler} value={value ?? ''} id={id}>
                <option value="">All</option>
                <option value="" disabled/>
                {orderDates.map(date => (
                    <option key={date} value={date}>{dayjs(date).format('MM/DD/YYYY')}</option>))}
            </FormSelect>
        </>
    )
}

export default OrderDateFilterSelect;
