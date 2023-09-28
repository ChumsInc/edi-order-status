import React, {useId, useState} from "react";
import classNames from "classnames";
import {OrderStatusField} from "./types";
import OrderStatusTooltip from "./OrderStatusTooltip";
import {saveSelectedStatus} from "./actions";
import {useAppDispatch} from "../../app/configureStore";
import Popover from '@mui/material/Popover'

interface OrderStatusTHProps {
    type: OrderStatusField,
    enabled?: boolean,
    children?: React.ReactNode
}

const OrderStatusTH = ({type, enabled, children}: OrderStatusTHProps) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const id = useId();

    const clickHandler = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        setAnchorEl(ev.currentTarget);
    }

    const closeHandler = () => {
        setAnchorEl(null);
    }

    const onSetStatus = (value: number) => {
        dispatch(saveSelectedStatus({key: type, value}))
        setAnchorEl(null);
    }
    return (
        <th className={classNames('text-center', {'tooltip-toggle': enabled})}>
            <button aria-describedby={id} disabled={!enabled} type="button"
                    className="btn btn-sm btn-light" onClick={clickHandler}>{children}</button>
            <Popover open={Boolean(anchorEl)} id={id} anchorEl={anchorEl} onClose={closeHandler}
                     anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                <OrderStatusTooltip onClick={onSetStatus}/>
            </Popover>
        </th>
    )
}

export default OrderStatusTH;
