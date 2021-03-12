import { EDIOrder, EDIOrderSorter, OrderSort } from "./types";
export declare const sortFunctions: EDIOrderSorter;
export declare const EDIOrderSortHandler: (list: EDIOrder[], { field, asc }: OrderSort) => EDIOrder[];
