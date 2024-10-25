import React, {useId, useState} from "react";
import classNames from "classnames";
import {EDIOrder, OrderStatus, OrderStatusField, OrderStatusUpdate} from "./types";
import {friendlyDateTime, orderStatusClassName, orderStatusColor} from "./utils";
import {saveOrderStatus} from "./actions";
import OrderStatusTooltip from "./OrderStatusTooltip";
import {useAppDispatch} from "../../app/configureStore";
import Popover from "@mui/material/Popover";
import Button from "react-bootstrap/Button";


interface OrderStatusButtonProps {
    order: EDIOrder,
    type: OrderStatusField,
}

const OrderStatusButton = ({order, type}: OrderStatusButtonProps) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const id = useId();

    if (order.OrderStatus === 'X') {
        return null;
    }
    const status: OrderStatus = order.status_json[type] as OrderStatus;
    const currentStatusClassName = orderStatusClassName(status?.value);


    const closeHandler = () => {
        setAnchorEl(null);
    }

    const onSetStatus = (value: number) => {
        setAnchorEl(null);
        if (order.completed) {
            return;
        }
        const statusCode: OrderStatusUpdate = {key: type, value};
        dispatch(saveOrderStatus({salesOrder: order, statusCode}));
    }

    const onOpenDropDown = (ev: React.MouseEvent<HTMLButtonElement>) => {
        if (order.completed) {
            return;
        }
        setAnchorEl(ev.currentTarget);
    }

    return (
        <div className="status-button-select text-center">
            <Button aria-describedby={id} size="sm" variant={orderStatusColor(status?.value)}
                    type="button" onClick={onOpenDropDown}
                    title={status?.userName}>
                {!status?.date ? '-' : friendlyDateTime(status.date)}
            </Button>
            <Popover open={Boolean(anchorEl)} id={id} anchorEl={anchorEl} onClose={closeHandler}
                     anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                <OrderStatusTooltip onClick={onSetStatus}/>
            </Popover>
        </div>
    )
}

export default OrderStatusButton;
