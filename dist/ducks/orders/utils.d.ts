import { EDIOrder } from "./types";
import { Customer } from "../customers";
export declare const customerKey: (row: EDIOrder | Customer) => string;
export declare const orderKey: (row: EDIOrder) => string;
export declare const orderStatusClassName: (value: string | number | null) => "btn-info" | "btn-success" | "btn-warning" | "btn-danger" | "btn-dark" | "btn-light";
export declare const friendlyDate: (val: string | Date) => string;
export declare const friendlyDateTime: (val: string | Date) => string;
