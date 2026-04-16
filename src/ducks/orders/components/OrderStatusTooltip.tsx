import OrderStatusTooltipItem from "./OrderStatusTooltipItem.tsx";
import Stack, {type StackProps} from "react-bootstrap/Stack";

interface OrderStatusTooltipProps extends Omit<StackProps, 'onClick'> {
    onClick: (val: number) => void,
}

const OrderStatusTooltip = ({onClick, ...props}:OrderStatusTooltipProps) => {
    return (
        <Stack role="tooltip" direction="vertical" gap={1} style={{maxWidth: '10rem'}}
               {...props}
               className="p-1 status-button-select status-button-tooltip bg-light">
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
