import React from "react";
import { EDIOrder, StatusPopupKey } from "../ducks/orders/types";
interface Props {
    order: EDIOrder;
    statusPopup: StatusPopupKey;
}
declare const OrderCompletedButton: React.FC<Props>;
export default OrderCompletedButton;
