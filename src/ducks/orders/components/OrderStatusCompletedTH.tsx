import {type ReactNode} from "react";
import classNames from "classnames";
import type {EDIOrderStatusField} from "chums-types";
import {saveSelectedStatus} from "../actions.ts";
import OrderCompletedTooltip from "./OrderCompletedTooltip.tsx";
import {useAppDispatch} from "@/app/configureStore.ts";
import Button from "react-bootstrap/Button";
import {OverlayTrigger} from "react-bootstrap";
import type {OverlayInjectedProps} from "react-bootstrap/esm/Overlay";

interface Props {
    statusCode: EDIOrderStatusField,
    enabled?: boolean,
    children?: ReactNode,
}

const OrderStatusCompletedTH = ({statusCode, enabled, children}: Props) => {
    const dispatch = useAppDispatch();


    const onSetStatus = async (value: number) => {
        await dispatch(saveSelectedStatus({statusCode, value}))
    }

    const renderTooltip = (props: OverlayInjectedProps) => {
        return (
            <OrderCompletedTooltip onClick={onSetStatus} {...props}/>
        )
    }

    return (
        <th className={classNames('text-center', {'tooltip-toggle': enabled})}>
            <OverlayTrigger overlay={renderTooltip} trigger="focus" placement="bottom" delay={{show: 250, hide: 400}}>
                <Button disabled={!enabled} type="button"
                        style={{minWidth: '3rem'}}
                        size="sm" variant="light">
                    {children}
                </Button>
            </OverlayTrigger>
        </th>
    )
}

export default OrderStatusCompletedTH;
