import React from "react";
import OrderStatusTooltipItem from "./OrderStatusTooltipItem";

interface OrderStatusTooltipProps {
    onClick: (val: number) => void,
}

const OrderStatusTooltip: React.FC<OrderStatusTooltipProps> = ({onClick}) => {
    return (
        <div className="tooltip bs-tooltip-bottom show" role="tooltip">
            <div className="tooltip-arrow"/>
            <ul className="tooltip-inner status-group">
                <li style={{whiteSpace: 'nowrap'}}>New Status</li>
                <OrderStatusTooltipItem color="light" value={0} text="-" onClick={onClick}/>
                <OrderStatusTooltipItem color="info" value={1} text="In Process" onClick={onClick}/>
                <OrderStatusTooltipItem color="success" value={2} text="Done" onClick={onClick}/>
                <OrderStatusTooltipItem color="warning" value={3} text="Waiting" onClick={onClick}/>
                <OrderStatusTooltipItem color="danger" value={4} text="On Hold" onClick={onClick}/>
                <OrderStatusTooltipItem color="dark" value={5} text="N/A" onClick={onClick}/>
            </ul>
        </div>
    )
}

export default OrderStatusTooltip;
