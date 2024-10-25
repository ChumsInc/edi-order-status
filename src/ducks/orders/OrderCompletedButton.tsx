import React, {useId, useState} from "react";
import {EDIOrder} from "./types";
import {friendlyDateTime} from "./utils";
import {saveOrderStatus} from "./actions";
import OrderCompletedTooltip from "./OrderCompletedTooltip";
import {useAppDispatch} from "../../app/configureStore";
import Popover from "@mui/material/Popover";
import Button from "react-bootstrap/Button";


interface Props {
    order: EDIOrder,
}

const OrderCompletedButton: React.FC<Props> = ({order}) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const id = useId();

    if (order.OrderStatus === 'X') {
        return null;
    }
    const {completed, completedByUserName} = order;

    const clickHandler = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        setAnchorEl(ev.currentTarget);
    }

    const onSetStatus = (value: number) => {
        const statusCode = {key: 'completed', value};
        dispatch(saveOrderStatus({salesOrder: order, statusCode}));
        setAnchorEl(null);
    }

    const closeHandler = () => {
        setAnchorEl(null);
    }

    return (
        <div className="status-button-select" role="group">
            <Button size="sm" type="button" variant={!completed ? 'light' : 'success'}
                    onClick={clickHandler}
                    title={completedByUserName}>
                {!completed ? '-' : friendlyDateTime(completed)}
            </Button>
            <Popover open={Boolean(anchorEl)} id={id} anchorEl={anchorEl} onClose={closeHandler}
                     anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                <OrderCompletedTooltip onClick={onSetStatus}/>
            </Popover>
        </div>
    )
}

export default OrderCompletedButton;
