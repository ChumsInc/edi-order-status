import React from "react";
import { EDIOrder, StatusPopupKey } from "../ducks/orders/types";
interface Props {
    row: EDIOrder;
    statusPopup: StatusPopupKey;
}
declare const EDIOrderRow: React.FC<Props>;
export default EDIOrderRow;
