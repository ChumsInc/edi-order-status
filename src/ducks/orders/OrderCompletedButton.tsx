import React from "react";
import classNames from "classnames";
import {EDIOrder, StatusPopupKey} from "./types";
import {friendlyDateTime, orderKey} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {onChangeOrderStatusAction, statusPopupEquality, toggleStatusPopupAction} from "./actions";
import OrderCompletedTooltip from "./OrderCompletedTooltip";
import {RootState} from "../index";


interface Props {
    order: EDIOrder,
}

const OrderCompletedButton: React.FC<Props> = ({order}) => {
    const statusPopup: StatusPopupKey = useSelector((state: RootState) => state.orders.statusPopup);
    if (order.OrderStatus === 'X') {
        return null;
    }
    const dispatch = useDispatch();
    const {completed, completedByUserName} = order;
    const currentStatusClassName = {
        'btn-light': !completed,
        'btn-success': !!completed,
    };
    const _statusPopup: StatusPopupKey = {key: orderKey(order), statusField: 'completed'};
    const expanded = statusPopupEquality(statusPopup, _statusPopup)

    const clickHandler = (value: number) => {
        dispatch(onChangeOrderStatusAction(order, {key: 'completed', value}));
    }

    const onOpenDropDown = () => {
        dispatch(toggleStatusPopupAction(_statusPopup))
    }

    return (
        <div className={classNames("status-button-select", {open: expanded})} role="group">
            <button type="button"
                    onClick={onOpenDropDown}
                    title={completedByUserName}
                    className={classNames("btn", currentStatusClassName)} aria-expanded={expanded}>
                {!completed ? '-' : friendlyDateTime(completed)}
            </button>
            {expanded && (<OrderCompletedTooltip onClick={clickHandler}/>)}
        </div>
    )
}

export default OrderCompletedButton;
