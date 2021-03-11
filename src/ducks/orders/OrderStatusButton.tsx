import React, {EventHandler, useState} from "react";
import classNames from "classnames";
import {EDIOrder, OrderStatus, StatusPopupKey} from "./types";
import {friendlyDateTime, orderKey, orderStatusClassName} from "./utils";
import {useDispatch} from "react-redux";
import {onChangeOrderStatus, statusPopupEquality, toggleStatusPopup} from "./actions";
import OrderStatusTooltip from "./OrderStatusTooltip";


interface Props {
    order: EDIOrder,
    type: string,
    statusPopup: StatusPopupKey,
}

const OrderStatusButton:React.FC<Props> = ({order, type, statusPopup}) => {
    if (order.OrderStatus === 'X') {
        return null;
    }
    const dispatch = useDispatch();
    const status = order.status_json[type] || {};
    const currentStatusClassName = orderStatusClassName(status.value);
    const _statusPopup:StatusPopupKey = {key: orderKey(order), statusField: type};
    const expanded = statusPopupEquality(statusPopup, _statusPopup)

    const clickHandler = (value:number) => {
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
            {expanded && (<OrderStatusTooltip onClick={clickHandler} />)}
        </div>
    )
}

export default OrderStatusButton;
