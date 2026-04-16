import {createContext, type RefObject} from "react";

export interface OrdersFormState {
    formRef: RefObject<HTMLFormElement|null>;
    loadOrders: () => void;
    completed: boolean;
    setCompleted: (completed: boolean) => void;
    minDate: string;
    maxDate: string;
    setMinDate: (minDate: string) => void;
    setMaxDate: (maxDate: string) => void;
    autoRefresh: boolean;
    setAutoRefresh: (autoRefresh: boolean) => void;
    updated: string;
}

const OrdersFormContext = createContext<OrdersFormState|null>(null);
export default OrdersFormContext;
