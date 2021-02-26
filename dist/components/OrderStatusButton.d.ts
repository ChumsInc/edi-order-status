import React from "react";
import { EDIOrder, StatusPopupKey } from "../ducks/orders/types";
interface Props {
    order: EDIOrder;
    type: string;
    statusPopup: StatusPopupKey;
}
declare const OrderStatusButton: React.FC<Props>;
export default OrderStatusButton;
