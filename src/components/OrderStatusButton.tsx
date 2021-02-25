import React, {EventHandler, useState} from "react";
import classNames from "classnames";
import {EDIOrder, OrderStatus, StatusPopupKey} from "../ducks/orders/types";
import {friendlyDateTime, orderKey, orderStatusClassName} from "../ducks/orders/utils";
import {useDispatch} from "react-redux";
import {onChangeOrderStatus, statusPopupEquality, toggleStatusPopup} from "../ducks/orders/actions";


interface Props {
    order: EDIOrder,
    type: string,
    statusPopup: StatusPopupKey,
}

const OrderStatusButton:React.FC<Props> = ({order, type, statusPopup}) => {
    const dispatch = useDispatch();
    const status = order.status_json[type] || {};
    const currentStatusClassName = orderStatusClassName(status.value);
    const now = friendlyDateTime(new Date());
    const _statusPopup:StatusPopupKey = {key: orderKey(order), statusField: type};
    const expanded = statusPopupEquality(statusPopup, _statusPopup)

    const clickHandler = (value:number) => {
        dispatch(onChangeOrderStatus(order, {key: type, value}));
    }

    const onOpenDropDown = () => {
        dispatch(toggleStatusPopup(_statusPopup))
    }

    return (
        <div className={classNames("status-button-select", {open: expanded})} role="group">
            <button type="button"
                    onClick={onOpenDropDown}
                    className={classNames("btn", currentStatusClassName)} aria-expanded={expanded}>
                {!status.date ? '-' : friendlyDateTime(status.date)}
            </button>
            {expanded && (
                <div className={classNames("tooltip bs-tooltip-bottom", {show: expanded})} role="tooltip">
                    <div className="tooltip-arrow" />
                    <ul className={classNames("tooltip-inner status-group")}>
                        <li style={{whiteSpace: 'nowrap'}}>New Status</li>
                        <li className="btn btn-light" onClick={() => clickHandler(0)}>-</li>
                        <li className="btn btn-info" onClick={() => clickHandler(1)}>{now}</li>
                        <li className="btn btn-success" onClick={() => clickHandler(2)}>{now}</li>
                        <li className="btn btn-warning" onClick={() => clickHandler(3)}>{now}</li>
                        <li className="btn btn-danger" onClick={() => clickHandler(4)}>{now}</li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default OrderStatusButton;
