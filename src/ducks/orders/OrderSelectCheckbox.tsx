import React, {useId} from 'react';
import {EDIOrder} from "chums-types";
import {useDispatch} from "react-redux";
import {toggleOrderSelected} from "./actions";
import {orderKey} from "./utils";
import FormCheck from "react-bootstrap/FormCheck";

interface OrderSelectCheckboxProps {
    order: EDIOrder
}

const OrderSelectCheckbox = ({order}:OrderSelectCheckboxProps) => {
    const dispatch = useDispatch();
    const id = useId();

    const onChange = (order: EDIOrder) => {
        dispatch(toggleOrderSelected({list: [orderKey(order)], checked: !order.selected}));
    }
    return (
        <FormCheck type="checkbox" checked={order.selected ?? false} id={id}
                   onClick={(ev) => ev.stopPropagation()} onChange={() => onChange(order)}
                   disabled={order.OrderStatus === 'X'} />
    )
}

export default OrderSelectCheckbox;
