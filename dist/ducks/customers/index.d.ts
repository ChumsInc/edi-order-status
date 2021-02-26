import { Action, AnyAction } from 'redux';
import { ThunkAction } from "redux-thunk";
import { RootState } from "../index";
export interface Customer {
    ARDivisionNo: string;
    CustomerNo: string;
    CustomerName: string;
}
export interface CustomerState {
    list: Customer[];
    loading: boolean;
}
export interface CustomerAction extends AnyAction {
    payload?: {
        customers?: Customer[];
    };
}
export interface CustomerThunkAction extends ThunkAction<void, RootState, unknown, Action<string>> {
}
export declare const fetchCustomers: () => CustomerThunkAction;
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    list: Customer[];
    loading: boolean;
}>, CustomerAction>;
export default _default;
