import React, {useId, useState} from "react";
import classNames from "classnames";
import {EDIOrderStatusField} from "chums-types";
import {saveSelectedStatus} from "./actions";
import OrderCompletedTooltip from "./OrderCompletedTooltip";
import {useAppDispatch} from "../../app/configureStore";
import Button from "react-bootstrap/Button";
import {ClickAwayListener, Popper} from "@mui/base";

interface Props {
    statusCode: EDIOrderStatusField,
    enabled?: boolean,
    children?: React.ReactNode,
}

const OrderStatusCompletedTH = ({statusCode, enabled, children}: Props) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const id = useId();

    const clickHandler = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        if (anchorEl) {
            setAnchorEl(null)
        } else {
            setAnchorEl(ev.currentTarget);
        }
    }

    const closeHandler = () => {
        setAnchorEl(null);
    }

    const onSetStatus = (value: number) => {
        dispatch(saveSelectedStatus({statusCode, value}))
        setAnchorEl(null);
    }
    return (
        <ClickAwayListener onClickAway={closeHandler}>
            <th className={classNames('text-center', {'tooltip-toggle': enabled})}>
                <Button aria-describedby={id} disabled={!enabled} type="button"
                        size="sm" variant="light" onClick={clickHandler}>
                    {children}
                </Button>
                <Popper open={Boolean(anchorEl)} id={id} anchorEl={anchorEl} placement="bottom">
                    <OrderCompletedTooltip onClick={onSetStatus}/>
                </Popper>
            </th>
        </ClickAwayListener>
    )
}

export default OrderStatusCompletedTH;
