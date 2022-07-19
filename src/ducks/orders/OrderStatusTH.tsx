import React from "react";
import classNames from "classnames";
import {OrderStatusField, StatusPopupKey} from "./types";
import OrderStatusTooltip from "./OrderStatusTooltip";
import {useSelector} from "react-redux";
import {RootState} from "../index";
import {onMassChangeOrderStatusAction, statusPopupEquality, toggleStatusPopupAction} from "./actions";
import {useAppDispatch} from "../../app/hooks";

interface Props {
    type: OrderStatusField,
    enabled?: boolean,
    children?: React.ReactNode
}

const OrderStatusTH: React.FC<Props> = ({type, enabled, children}) => {
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
                <OrderStatusTooltip onClick={(value) => dispatch(onMassChangeOrderStatusAction({key: type, value}))}/>
            )}
        </th>
    )
}

export default OrderStatusTH;
