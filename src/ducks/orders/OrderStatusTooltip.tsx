import React from "react";
import OrderStatusTooltipItem from "./OrderStatusTooltipItem";
import Stack from "@mui/material/Stack";

interface OrderStatusTooltipProps {
    onClick: (val: number) => void,
}

const OrderStatusTooltip: React.FC<OrderStatusTooltipProps> = ({onClick}) => {
    return (
        <Stack role="tooltip" direction="column" spacing={1} sx={{p: 1}} className="status-button-select">
            <OrderStatusTooltipItem color="light" value={0} text="Clear" onClick={onClick}/>
            <OrderStatusTooltipItem color="info" value={1} text="In Process" onClick={onClick}/>
            <OrderStatusTooltipItem color="success" value={2} text="Done" onClick={onClick}/>
            <OrderStatusTooltipItem color="warning" value={3} text="Waiting" onClick={onClick}/>
            <OrderStatusTooltipItem color="danger" value={4} text="On Hold" onClick={onClick}/>
            <OrderStatusTooltipItem color="dark" value={5} text="N/A" onClick={onClick}/>
        </Stack>
    )
}

export default OrderStatusTooltip;
