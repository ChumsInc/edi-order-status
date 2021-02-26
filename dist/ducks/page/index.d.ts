import { AnyAction } from 'redux';
export interface PageState {
    page: number;
    rowsPerPage: number;
}
export interface PageAction extends AnyAction {
    payload: {
        page?: number;
        rowsPerPage?: number;
    };
}
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    page: number;
    rowsPerPage: number;
}>, PageAction>;
export default _default;
export declare const setRowsPerPage: (rowsPerPage: number) => PageAction;
export declare const setPage: (page: number) => PageAction;
