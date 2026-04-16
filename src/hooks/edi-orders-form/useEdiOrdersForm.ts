import {useContext} from "react";
import OrdersFormContext from "@/hooks/edi-orders-form/OrdersFormContext.tsx";

export const useEdiOrdersForm = () => {
    const context = useContext(OrdersFormContext);
    if (!context) {
        throw new Error(`useEdiOrdersForm must be used within an OrdersFormProvider`);
    }
    return context;
}
