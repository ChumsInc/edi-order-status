import React, {EventHandler, useState} from "react";
import classNames from "classnames";
import {EDIOrder, OrderStatus, StatusPopupKey} from "./types";
import {friendlyDateTime, orderKey, orderStatusClassName} from "./utils";
import {useDispatch} from "react-redux";
import {onChangeOrderStatus, statusPopupEquality, toggleStatusPopup} from "./actions";
import OrderCompletedTooltip from "./OrderCompletedTooltip";


interface Props {
    order: EDIOrder,
    statusPopup: StatusPopupKey,
}

const OrderCompletedButton:React.FC<Props> = ({order, statusPopup}) => {
    if (order.OrderStatus === 'X') {
        return null;
    }
    const dispatch = useDispatch();
    const {completed, completedByUserName} = order;
    const currentStatusClassName = {
        'btn-light': !completed,
        'btn-success': !!completed,
    };
    const _statusPopup:StatusPopupKey = {key: orderKey(order), statusField: 'completed'};
    const expanded = statusPopupEquality(statusPopup, _statusPopup)

    const clickHandler = (value:number) => {
        dispatch(onChangeOrderStatus(order, {key: 'completed', value}));
    }

    const onOpenDropDown = () => {
        dispatch(toggleStatusPopup(_statusPopup))
    }

    return (
        <div className={classNames("status-button-select", {open: expanded})} role="group">
            <button type="button"
                    onClick={onOpenDropDown}
                    title={completedByUserName}
                    className={classNames("btn", currentStatusClassName)} aria-expanded={expanded}>
                {!completed ? '-' : friendlyDateTime(completed)}
            </button>
            {expanded && (<OrderCompletedTooltip onClick={clickHandler} />)}
        </div>
    )
}

export default OrderCompletedButton;
