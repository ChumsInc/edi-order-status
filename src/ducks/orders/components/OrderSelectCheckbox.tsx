import {type ChangeEvent, useId} from 'react';
import type {EDIOrder} from "chums-types";
import {useDispatch} from "react-redux";
import {toggleOrderSelected} from "../ordersSlice.ts";
import {orderKey} from "../utils.ts";
import FormCheck from "react-bootstrap/FormCheck";

interface OrderSelectCheckboxProps {
    order: EDIOrder
}

const OrderSelectCheckbox = ({order}:OrderSelectCheckboxProps) => {
    const dispatch = useDispatch();
    const id = useId();

    const onChange = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleOrderSelected({list: [orderKey(order)], checked: ev.target.checked}));
    }

    return (
        <FormCheck type="checkbox" checked={order.selected ?? false} id={id}
                   onChange={onChange}
                   disabled={order.OrderStatus === 'X'} />
    )
}

export default OrderSelectCheckbox;
