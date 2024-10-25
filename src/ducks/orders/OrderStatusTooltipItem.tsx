import React from 'react';
import Button, {ButtonProps} from 'react-bootstrap/Button'

interface OrderStatusTooltipItemProps extends Omit<ButtonProps, 'onClick' | 'value'> {
    value: number,
    text: string | null,
    onClick: (val: number) => void,
}

const OrderStatusTooltipItem = ({value, text, onClick, ...props}: OrderStatusTooltipItemProps) => {
    const clickHandler = (ev: React.MouseEvent) => {
        ev.stopPropagation();
        onClick(value)
    }
    return (
        <Button size="sm" type="button" onClick={clickHandler} {...props}>{text}</Button>
    );
};

export default OrderStatusTooltipItem;
