import React from "react";
import { EDIOrder, OrderStatusField } from "./types";
interface Props {
    order: EDIOrder;
    type: OrderStatusField;
}
declare const OrderStatusButton: React.FC<Props>;
export default OrderStatusButton;
