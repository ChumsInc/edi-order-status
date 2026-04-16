import {useContext} from "react";
import AutoRefreshContext from "@/components/auto-refresh/AutoRefreshContext.tsx";

export const useAutoRefresh = () => {
    const context = useContext(AutoRefreshContext);
    if (!context) throw new Error('useAutoRefresh must be used within a AutoRefreshProvider');
    return context;
};
