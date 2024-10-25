import React from "react";
import OrderStatusTooltipItem from "./OrderStatusTooltipItem";
import Stack from "react-bootstrap/Stack";

interface OrderStatusTooltipProps {
    onClick: (val: number) => void,
}

const OrderStatusTooltip = ({onClick}:OrderStatusTooltipProps) => {
    return (
        <Stack role="tooltip" direction="vertical" gap={1} className="p-1 status-button-select">
            <OrderStatusTooltipItem variant="light" value={0} text="Clear" onClick={onClick}/>
            <OrderStatusTooltipItem variant="info" value={1} text="In Process" onClick={onClick}/>
            <OrderStatusTooltipItem variant="success" value={2} text="Done" onClick={onClick}/>
            <OrderStatusTooltipItem variant="warning" value={3} text="Waiting" onClick={onClick}/>
            <OrderStatusTooltipItem variant="danger" value={4} text="On Hold" onClick={onClick}/>
            <OrderStatusTooltipItem variant="dark" value={5} text="N/A" onClick={onClick}/>
        </Stack>
    )
}

export default OrderStatusTooltip;
