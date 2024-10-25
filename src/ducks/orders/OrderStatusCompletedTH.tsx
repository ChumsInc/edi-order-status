import React, {useId, useState} from "react";
import classNames from "classnames";
import {OrderStatusField} from "./types";
import {saveSelectedStatus} from "./actions";
import OrderCompletedTooltip from "./OrderCompletedTooltip";
import {useAppDispatch} from "../../app/configureStore";
import Popover from "@mui/material/Popover";
import Button from "react-bootstrap/Button";

interface Props {
    type: OrderStatusField,
    enabled?: boolean,
    children?: React.ReactNode,
}

const OrderStatusCompletedTH = ({type, enabled, children}: Props) => {
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
            <Button aria-describedby={id} disabled={!enabled} type="button"
                    size="sm" variant="light" onClick={clickHandler}>
                {children}
            </Button>
            <Popover open={Boolean(anchorEl)} id={id} anchorEl={anchorEl} onClose={closeHandler}
                     anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                <OrderCompletedTooltip onClick={onSetStatus}/>
            </Popover>
        </th>
    )
}

export default OrderStatusCompletedTH;
