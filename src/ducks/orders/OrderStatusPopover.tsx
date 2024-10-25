import React from 'react';
import OrderStatusTooltip from "./OrderStatusTooltip";
import Popover, {PopoverProps} from "react-bootstrap/Popover";

export interface OrderStatusPopoverProps extends PopoverProps {
    onSetStatus: (val: number) => void,
}
export default function OrderStatusPopover({onSetStatus, ...props}:OrderStatusPopoverProps) {
    return (
        <Popover {...props}>
            <Popover.Body>
                <OrderStatusTooltip onClick={onSetStatus}/>
            </Popover.Body>
        </Popover>
    )
}
