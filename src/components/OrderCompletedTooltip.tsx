import React from "react";
import classNames from "classnames";
import {friendlyDateTime} from "../ducks/orders/utils";
import OrderStatusTooltipItem from "./OrderStatusTooltipItem";

interface OrderCompletedTooltipProps {
    onClick: (val:number) => void,
}

const OrderCompletedTooltip:React.FC<OrderCompletedTooltipProps> = ({onClick}) => {
    const now = friendlyDateTime(new Date());
    return (
        <div className="tooltip bs-tooltip-bottom show" role="tooltip">
            <div className="tooltip-arrow" />
            <ul className="tooltip-inner status-group">
                <li style={{whiteSpace: 'nowrap'}}>Completed</li>
                <OrderStatusTooltipItem color="light" value={0} text="-" onClick={onClick} />
                <OrderStatusTooltipItem color="success" value={1} text={now} onClick={onClick} />
            </ul>
        </div>
    )
}

export default OrderCompletedTooltip;
