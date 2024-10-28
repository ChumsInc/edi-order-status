import React, {useId, useState} from "react";
import {EDIOrder, EDIOrderStatus, EDIOrderStatusField} from "chums-types";
import {friendlyDateTime, orderStatusColor} from "./utils";
import {saveOrderStatus} from "./actions";
import OrderStatusTooltip from "./OrderStatusTooltip";
import {useAppDispatch} from "../../app/configureStore";
import Button from "react-bootstrap/Button";
import {ClickAwayListener, Popper} from "@mui/base";
import {OrderStatusUpdate} from "./types";


interface OrderStatusButtonProps {
    order: EDIOrder,
    type: EDIOrderStatusField,
}

const OrderStatusButton = ({order, type}: OrderStatusButtonProps) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const id = useId();

    if (order.OrderStatus === 'X') {
        return null;
    }
    const status: EDIOrderStatus = order.status_json[type] as EDIOrderStatus;


    const closeHandler = () => {
        setAnchorEl(null);
    }

    const onSetStatus = (value: number) => {
        setAnchorEl(null);
        if (order.completed) {
            return;
        }
        const statusCode: OrderStatusUpdate = {statusCode: type, value};
        dispatch(saveOrderStatus({salesOrder: order, status: statusCode}));
    }

    const onOpenDropDown = (ev: React.MouseEvent<HTMLButtonElement>) => {
        if (order.completed) {
            return;
        }
        if (anchorEl) {
            setAnchorEl(null)
        } else {
            setAnchorEl(ev.currentTarget);
        }
    }

    return (
        <ClickAwayListener onClickAway={closeHandler}>
            <div className="status-button-select text-center">
                <Button aria-describedby={id} size="sm" variant={orderStatusColor(status?.value)}
                        type="button" onClick={onOpenDropDown}
                        title={status?.userName}>
                    {!status?.date ? '-' : friendlyDateTime(status.date)}
                </Button>
                <Popper open={Boolean(anchorEl)} id={id} anchorEl={anchorEl}
                        placement="bottom">
                    <OrderStatusTooltip onClick={onSetStatus}/>
                </Popper>
            </div>
        </ClickAwayListener>
    )
}

export default OrderStatusButton;
