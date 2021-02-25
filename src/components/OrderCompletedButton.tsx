import React, {EventHandler, useState} from "react";
import classNames from "classnames";
import {EDIOrder, OrderStatus, StatusPopupKey} from "../ducks/orders/types";
import {friendlyDateTime, orderKey, orderStatusClassName} from "../ducks/orders/utils";
import {useDispatch} from "react-redux";
import {onChangeOrderStatus, statusPopupEquality, toggleStatusPopup} from "../ducks/orders/actions";


interface Props {
    order: EDIOrder,
    statusPopup: StatusPopupKey,
}

const OrderCompletedButton:React.FC<Props> = ({order, statusPopup}) => {
    const app = document.getElementById('app');
    const dispatch = useDispatch();
    const {completed, completedByUserName} = order;
    const currentStatusClassName = {
        'btn-outline-dark': !completed,
        'btn-success': !!completed,
    };
    const _statusPopup:StatusPopupKey = {key: orderKey(order), statusField: 'completed'};
    const expanded = statusPopupEquality(statusPopup, _statusPopup)
    const now = friendlyDateTime(new Date());

    const clickHandler = (value:number) => {
        dispatch(onChangeOrderStatus(order, {key: 'completed', value}));
    }

    const onOpenDropDown = () => {
        dispatch(toggleStatusPopup(_statusPopup))
    }

    return (
        <div className={classNames("btn-group btn-group-sm status-button-select", {open: expanded})} role="group">
            <button type="button"
                    onClick={onOpenDropDown}
                    title={completedByUserName}
                    className={classNames("btn", currentStatusClassName)} aria-expanded={expanded}>
                {!completed ? '-' : friendlyDateTime(completed)}
            </button>
            {expanded && (
                <ul className={classNames("dropdown-menu status-group", {show: expanded})}>
                    <li className="btn btn-outline-dark" onClick={() => clickHandler(0)}>-</li>
                    <li className="btn btn-success" onClick={() => clickHandler(1)}>{now}</li>
                </ul>
            )}
        </div>
    )
}

export default OrderCompletedButton;
