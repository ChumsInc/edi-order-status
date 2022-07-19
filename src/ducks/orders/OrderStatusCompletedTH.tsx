import React from "react";
import classNames from "classnames";
import {OrderStatusField, StatusPopupKey} from "./types";
import {useSelector} from "react-redux";
import {RootState} from "../index";
import {onMassChangeOrderStatusAction, statusPopupEquality, toggleStatusPopupAction} from "./actions";
import OrderCompletedTooltip from "./OrderCompletedTooltip";
import {useAppDispatch} from "../../app/hooks";

interface Props {
    type: OrderStatusField,
    enabled?: boolean,
    children?: React.ReactNode,
}

const OrderStatusCompletedTH = ({type, enabled, children}: Props) => {
    const statusPopup: StatusPopupKey = useSelector((state: RootState) => state.orders.statusPopup);
    const dispatch = useAppDispatch();
    const thisStatusPopup: StatusPopupKey = {key: 'th', statusField: type};
    const expanded = !!enabled && statusPopupEquality(statusPopup, thisStatusPopup);

    const clickHandler = (ev: React.MouseEvent) => {
        ev.stopPropagation();
        dispatch(toggleStatusPopupAction(thisStatusPopup))
    }

    return (
        <th className={classNames({'tooltip-toggle': enabled})}>
            <div onClick={clickHandler}>{children}</div>
            {expanded && (
                <OrderCompletedTooltip
                    onClick={(value) => dispatch(onMassChangeOrderStatusAction({key: type, value}))}/>
            )}
        </th>
    )
}

export default OrderStatusCompletedTH;
