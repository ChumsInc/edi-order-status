import React, {useId, useState} from "react";
import classNames from "classnames";
import {EDIOrder} from "./types";
import {friendlyDateTime} from "./utils";
import {saveOrderStatus} from "./actions";
import OrderCompletedTooltip from "./OrderCompletedTooltip";
import {useAppDispatch} from "../../app/hooks";
import Popover from "@mui/material/Popover";


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
    const currentStatusClassName = {
        'btn-light': !completed,
        'btn-success': !!completed,
    };

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
            <button type="button"
                    onClick={clickHandler}
                    title={completedByUserName}
                    className={classNames("btn btn-sm", currentStatusClassName)}>
                {!completed ? '-' : friendlyDateTime(completed)}
            </button>
            <Popover open={Boolean(anchorEl)} id={id} anchorEl={anchorEl} onClose={closeHandler}
                     anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                <OrderCompletedTooltip onClick={onSetStatus}/>
            </Popover>
        </div>
    )
}

export default OrderCompletedButton;
