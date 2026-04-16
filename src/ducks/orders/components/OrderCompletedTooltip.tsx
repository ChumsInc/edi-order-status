import {friendlyDateTime} from "../utils.ts";
import OrderStatusTooltipItem from "./OrderStatusTooltipItem.tsx";
import Stack, {type StackProps} from "react-bootstrap/Stack";

interface OrderCompletedTooltipProps extends Omit<StackProps, 'onClick'> {
    onClick: (val: number) => void,
}

const OrderCompletedTooltip = ({onClick, ...props}:OrderCompletedTooltipProps) => {
    const now = friendlyDateTime(new Date());
    return (
        <Stack role="tooltip" direction="vertical" gap={1} style={{maxWidth: '10rem'}}
               {...props}
               className="p-1 status-button-select status-button-tooltip bg-light">
            <OrderStatusTooltipItem variant="light" value={0} text="Clear" onClick={onClick}/>
            <OrderStatusTooltipItem variant="success" value={1} text={now} onClick={onClick}/>
        </Stack>
    )
}

export default OrderCompletedTooltip;
