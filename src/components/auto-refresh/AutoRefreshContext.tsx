import {createContext} from "react";

export interface AutoRefreshState {
    checked: boolean;
    setChecked: (checked: boolean) => void;
    updated: string;
}

const AutoRefreshContext = createContext<AutoRefreshState | null>(null);
export default AutoRefreshContext;
