import React from "react";
import { Customer } from "../ducks/customers";
interface Props {
    onChange: (customer: Customer) => void;
    required?: boolean;
}
declare const CustomerFilterSelect: React.FC<Props>;
export default CustomerFilterSelect;
