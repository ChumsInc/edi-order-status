import React from "react";
import {friendlyDateTime} from "./utils";
import OrderStatusTooltipItem from "./OrderStatusTooltipItem";
import Stack from "@mui/material/Stack";

interface OrderCompletedTooltipProps {
    onClick: (val: number) => void,
}

const OrderCompletedTooltip = ({onClick}:OrderCompletedTooltipProps) => {
    const now = friendlyDateTime(new Date());
    return (
        <Stack role="tooltip" direction="column" spacing={1} sx={{p: 1}} className="status-button-select">
            <OrderStatusTooltipItem color="light" value={0} text="Clear" onClick={onClick}/>
            <OrderStatusTooltipItem color="success" value={2} text={now} onClick={onClick}/>
        </Stack>
    )
}

export default OrderCompletedTooltip;
