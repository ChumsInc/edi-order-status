import React from 'react';
import classNames from "classnames";

interface OrderStatusTooltipItemProps {
    color: 'light'|'info'|'success'|'warning'|'danger'|'dark',
    value: number,
    text: string|null,
    onClick: (val:number) => void,
}

const OrderStatusTooltipItem = ({color, value, text, onClick}:OrderStatusTooltipItemProps) => {
    const className = classNames({
        btn: true,
        ['btn-sm']: true,
        [`btn-${color}`]: true
    });
    const clickHandler = (ev:React.MouseEvent) => {
        ev.stopPropagation();
        onClick(value)
    }
    return (
        <button className={className} onClick={clickHandler}>{text}</button>
    );
};

export default OrderStatusTooltipItem;
