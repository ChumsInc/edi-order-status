import {useContext} from "react";
import {OrdersContext} from "@/hooks/edi-orders/OrdersContext.tsx";

export const useEDIOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) throw new Error('useEDIOrders must be used within a OrdersProvider');
    return context;
};
