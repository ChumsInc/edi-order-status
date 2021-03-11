import React from 'react';
import classNames from "classnames";

interface OrderStatusTooltipItemProps {
    color: 'light'|'info'|'success'|'warning'|'danger'|'dark',
    value: number,
    text: string,
    onClick: (val:number) => void,
}

const OrderStatusTooltipItem:React.FC<OrderStatusTooltipItemProps> = ({color, value, text, onClick}) => {
    const className = classNames({
        btn: true,
        [`btn-${color}`]: true
    })
    return (
        <li className={className} onClick={() => onClick(value)}>{text}</li>
    );
};

export default OrderStatusTooltipItem;
