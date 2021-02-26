import React from "react";
import classNames from "classnames";
import {friendlyDateTime} from "../ducks/orders/utils";
import OrderStatusTooltipItem from "./OrderStatusTooltipItem";

interface OrderStatusTooltipProps {
    onClick: (val:number) => void,
}

const OrderStatusTooltip:React.FC<OrderStatusTooltipProps> = ({onClick}) => {
    const now = friendlyDateTime(new Date());
    return (
        <div className="tooltip bs-tooltip-bottom show" role="tooltip">
            <div className="tooltip-arrow" />
            <ul className="tooltip-inner status-group">
                <li style={{whiteSpace: 'nowrap'}}>New Status</li>
                <OrderStatusTooltipItem color="light" value={0} text="-" onClick={onClick} />
                <OrderStatusTooltipItem color="info" value={1} text={now} onClick={onClick} />
                <OrderStatusTooltipItem color="success" value={2} text={now} onClick={onClick} />
                <OrderStatusTooltipItem color="warning" value={3} text={now} onClick={onClick} />
                <OrderStatusTooltipItem color="danger" value={4} text={now} onClick={onClick} />
            </ul>
        </div>
    )
}

export default OrderStatusTooltip;
