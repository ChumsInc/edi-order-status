import React from "react";
import { EDIOrder, StatusPopupKey } from "../ducks/orders/types";
interface Props {
    rows: EDIOrder[];
    statusPopup: StatusPopupKey;
}
declare const EDIOrderTable: React.FC<Props>;
export default EDIOrderTable;
