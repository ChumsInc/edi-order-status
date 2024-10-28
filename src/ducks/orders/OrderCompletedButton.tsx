import React, {useId, useState} from "react";
import {EDIOrder} from "chums-types";
import {friendlyDateTime} from "./utils";
import {saveOrderStatus} from "./actions";
import OrderCompletedTooltip from "./OrderCompletedTooltip";
import {useAppDispatch} from "../../app/configureStore";
import Button from "react-bootstrap/Button";
import {ClickAwayListener, Popper} from "@mui/base";


interface OrderCompletedButtonProps {
    order: EDIOrder,
}

const OrderCompletedButton = ({order}: OrderCompletedButtonProps) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const id = useId();

    if (order.OrderStatus === 'X') {
        return null;
    }
    const {completed, completedByUserName} = order;

    const clickHandler = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        if (anchorEl) {
            setAnchorEl(null)
        } else {
            setAnchorEl(ev.currentTarget);
        }
    }

    const onSetStatus = (value: number) => {
        const statusCode = {statusCode: 'completed', value};
        dispatch(saveOrderStatus({salesOrder: order, status: statusCode}));
        setAnchorEl(null);
    }

    const closeHandler = () => {
        setAnchorEl(null);
    }

    return (
        <ClickAwayListener onClickAway={closeHandler}>
            <div className="status-button-select" role="group">
                <Button size="sm" type="button" variant={!completed ? 'transparent' : 'success'}
                        onClick={clickHandler}
                        title={completedByUserName}>
                    {!completed ? '-' : friendlyDateTime(completed)}
                </Button>
                <Popper open={Boolean(anchorEl)} id={id} anchorEl={anchorEl}
                        placement="bottom">
                    <OrderCompletedTooltip onClick={onSetStatus}/>
                </Popper>
            </div>
        </ClickAwayListener>
    )
}

export default OrderCompletedButton;
