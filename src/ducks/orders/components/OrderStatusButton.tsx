import type {EDIOrder, EDIOrderStatus, EDIOrderStatusField} from "chums-types";
import {friendlyDateTime, orderStatusColor} from "../utils.ts";
import {saveOrderStatus} from "../actions.ts";
import OrderStatusTooltip from "./OrderStatusTooltip.tsx";
import {useAppDispatch} from "@/app/configureStore.ts";
import Button from "react-bootstrap/Button";
import type {OrderStatusUpdate} from "../types.ts";
import {OverlayTrigger} from "react-bootstrap";
import type {OverlayInjectedProps} from "react-bootstrap/esm/Overlay";


interface OrderStatusButtonProps {
    order: EDIOrder,
    type: EDIOrderStatusField,
}

const OrderStatusButton = ({order, type}: OrderStatusButtonProps) => {
    const dispatch = useAppDispatch();

    if (order.OrderStatus === 'X') {
        return null;
    }
    const status: EDIOrderStatus = order.status_json[type] as EDIOrderStatus;

    const onSetStatus = async (value: number) => {
        if (order.completed) {
            return;
        }
        const statusCode: OrderStatusUpdate = {statusCode: type, value};
        await dispatch(saveOrderStatus({salesOrder: order, status: statusCode}));
    }

    const renderTooltip = (props: OverlayInjectedProps) => {
        return <OrderStatusTooltip onClick={onSetStatus} {...props}/>
    }

    return (
        <div className="status-button-select text-center" style={{position: 'relative'}}>
            <OverlayTrigger placement="bottom" trigger="focus" overlay={renderTooltip} delay={{show: 250, hide: 400}}>
                <Button size="sm" variant={orderStatusColor(status?.value)}
                        style={{minWidth: '3rem'}}
                        type="button"
                        title={status?.userName}>
                    {!status?.date ? '-' : friendlyDateTime(status.date)}
                </Button>
            </OverlayTrigger>
        </div>
    )
}

export default OrderStatusButton;
