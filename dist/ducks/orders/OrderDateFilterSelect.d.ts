import React from "react";
interface Props {
    onChange: (orderDate: string) => void;
    value: string;
}
declare const OrderDateFilterSelect: React.FC<Props>;
export default OrderDateFilterSelect;
