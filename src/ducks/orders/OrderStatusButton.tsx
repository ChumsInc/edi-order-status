import React from "react";
import classNames from "classnames";
import {EDIOrder, OrderStatusField, StatusPopupKey} from "./types";
import {friendlyDateTime, orderKey, orderStatusClassName} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {onChangeOrderStatus, statusPopupEquality, toggleStatusPopup} from "./actions";
import OrderStatusTooltip from "./OrderStatusTooltip";
import {RootState} from "../index";


interface Props {
    order: EDIOrder,
    type: OrderStatusField,
}

const OrderStatusButton: React.FC<Props> = ({order, type}) => {
    const statusPopup: StatusPopupKey = useSelector((state: RootState) => state.orders.statusPopup);
    if (order.OrderStatus === 'X') {
        return null;
    }
    const dispatch = useDispatch();
    const status = order.status_json[type] || {};
    const currentStatusClassName = orderStatusClassName(status.value);
    const _statusPopup: StatusPopupKey = {key: orderKey(order), statusField: type};
    const expanded = statusPopupEquality(statusPopup, _statusPopup)

    const clickHandler = (value: number) => {
        if (order.completed) {
            return;
        }
        dispatch(onChangeOrderStatus(order, {key: type, value}));
    }

    const onOpenDropDown = () => {
        if (order.completed) {
            return;
        }
        dispatch(toggleStatusPopup(_statusPopup))
    }

    return (
        <div className={classNames("status-button-select", {open: expanded})} role="group">
            <button type="button" onClick={onOpenDropDown}
                    title={status.userName}
                    className={classNames("btn", currentStatusClassName)} aria-expanded={expanded}>
                {!status.date ? '-' : friendlyDateTime(status.date)}
            </button>
            {expanded && (<OrderStatusTooltip onClick={clickHandler}/>)}
        </div>
    )
}

export default OrderStatusButton;
