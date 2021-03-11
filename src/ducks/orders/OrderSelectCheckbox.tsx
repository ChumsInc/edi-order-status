import React, {ChangeEvent} from 'react';
import {EDIOrder} from "./types";
import {useDispatch} from "react-redux";
import {selectOrders} from "./actions";
import {orderKey} from "./utils";

interface Props {
    order: EDIOrder
}

const OrderSelectCheckbox:React.FC<Props> = ({order}) => {
    const dispatch = useDispatch();
    const onChange = (order:EDIOrder) => {
        dispatch(selectOrders([orderKey(order)], !order.selected));
    }

    return (
        <div className="form-check form-check-inline">
            <input type="checkbox" className="form-check-input"
                   checked={order.selected || false} disabled={order.OrderStatus === 'X'}
                   onChange={() => onChange(order)}/>
        </div>
    )

}

export default OrderSelectCheckbox;
