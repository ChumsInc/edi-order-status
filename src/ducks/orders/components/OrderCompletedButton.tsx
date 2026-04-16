import type {EDIOrder} from "chums-types";
import {friendlyDateTime} from "../utils.ts";
import {saveOrderStatus} from "../actions.ts";
import OrderCompletedTooltip from "./OrderCompletedTooltip.tsx";
import {useAppDispatch} from "@/app/configureStore.ts";
import Button from "react-bootstrap/Button";
import {OverlayTrigger} from "react-bootstrap";
import type {OverlayInjectedProps} from "react-bootstrap/esm/Overlay";


interface OrderCompletedButtonProps {
    order: EDIOrder,
}

const OrderCompletedButton = ({order}: OrderCompletedButtonProps) => {
    const dispatch = useAppDispatch();

    if (order.OrderStatus === 'X') {
        return null;
    }
    const {completed, completedByUserName} = order;


    const onSetStatus = async (value: number) => {
        const statusCode = {statusCode: 'completed', value};
        await dispatch(saveOrderStatus({salesOrder: order, status: statusCode}));
    }

    const renderTooltip = (props: OverlayInjectedProps) => {
        return (
            <OrderCompletedTooltip onClick={onSetStatus} {...props} />
        )
    }

    return (
        <div className="status-button-select" role="group">
            <OverlayTrigger overlay={renderTooltip} placement="bottom" trigger="focus"
                            delay={{show: 250, hide: 400}}>
                <Button size="sm" type="button" variant={!completed ? 'transparent' : 'success'}
                        style={{minWidth: '3rem'}}
                        title={completedByUserName}>
                    {!completed ? '-' : friendlyDateTime(completed)}
                </Button>
            </OverlayTrigger>
        </div>
    )
}

export default OrderCompletedButton;
