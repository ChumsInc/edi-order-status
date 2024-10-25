import React from "react";
import {friendlyDateTime} from "./utils";
import OrderStatusTooltipItem from "./OrderStatusTooltipItem";
import Stack from "react-bootstrap/Stack";

interface OrderCompletedTooltipProps {
    onClick: (val: number) => void,
}

const OrderCompletedTooltip = ({onClick}:OrderCompletedTooltipProps) => {
    const now = friendlyDateTime(new Date());
    return (
        <Stack role="tooltip" direction="vertical" gap={1} className="p-1 status-button-select">
            <OrderStatusTooltipItem variant="light" value={0} text="Clear" onClick={onClick}/>
            <OrderStatusTooltipItem variant="success" value={1} text={now} onClick={onClick}/>
        </Stack>
    )
}

export default OrderCompletedTooltip;
