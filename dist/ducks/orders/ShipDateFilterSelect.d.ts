import React from "react";
interface Props {
    onChange: (shipExpireDate: string) => void;
    value: string;
}
declare const ShipDateFilterSelect: React.FC<Props>;
export default ShipDateFilterSelect;
