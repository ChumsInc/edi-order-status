import {type ReactNode} from "react";
import classNames from "classnames";
import type {EDIOrderStatusField} from "chums-types";
import OrderStatusTooltip from "./OrderStatusTooltip.tsx";
import {saveSelectedStatus} from "../actions.ts";
import {useAppDispatch} from "@/app/configureStore.ts";
import Button from "react-bootstrap/Button";
import {OverlayTrigger} from "react-bootstrap";
import type {OverlayInjectedProps} from "react-bootstrap/esm/Overlay";

interface OrderStatusTHProps {
    statusCode: EDIOrderStatusField,
    enabled?: boolean,
    children?: ReactNode
}

const OrderStatusTH = ({statusCode, enabled, children}: OrderStatusTHProps) => {
    const dispatch = useAppDispatch();

    const onSetStatus = async (value: number) => {
        await dispatch(saveSelectedStatus({statusCode: statusCode, value}))
    }

    const renderTooltip = (props: OverlayInjectedProps) => {
        return (
            <OrderStatusTooltip onClick={onSetStatus} {...props}/>
        )
    }

    return (
        <th className={classNames('text-center', {'tooltip-toggle': enabled})}>
            <OverlayTrigger overlay={renderTooltip} trigger="focus" placement="bottom" delay={{show: 250, hide: 400}}>
                <Button disabled={!enabled} type="button"
                        style={{minWidth: '3rem'}}
                        variant="light" size="sm">
                    <span className="text-wrap">{children}</span>
                </Button>
            </OverlayTrigger>
        </th>
    )
}

export default OrderStatusTH;
