import React from 'react';
import {EDIOrder} from "./types";
import {useDispatch} from "react-redux";
import {toggleOrderSelected} from "./actions";
import {orderKey} from "./utils";

interface Props {
    order: EDIOrder
}

const OrderSelectCheckbox: React.FC<Props> = ({order}) => {
    const dispatch = useDispatch();
    const onChange = (order: EDIOrder) => {
        dispatch(toggleOrderSelected({list: [orderKey(order)], checked: !order.selected}));
    }

    return (
        <div className="form-check form-check-inline">
            <input type="checkbox" className="form-check-input"
                   checked={order.selected ?? false} disabled={order.OrderStatus === 'X'}
                   onClick={(ev) => ev.stopPropagation()}
                   onChange={() => onChange(order)}/>
        </div>
    )

}

export default OrderSelectCheckbox;
