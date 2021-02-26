declare const rootReducer: import("redux").Reducer<import("redux").CombinedState<{
    alerts: {
        counter: number;
        list: any[];
    };
    orders: import("redux").CombinedState<{
        loading: boolean;
        saving: boolean;
        filter: import("./orders/types").OrderFilter;
        list: import("./orders/types").EDIOrder[];
        statusPopup: never;
        sort: import("./orders/types").OrderSort;
    }>;
    page: import("redux").CombinedState<{
        page: number;
        rowsPerPage: number;
    }>;
    customers: import("redux").CombinedState<{
        list: import("./customers").Customer[];
        loading: boolean;
    }>;
}>, import("./orders/types").EDIOrdersAction | import("redux").AnyAction | import("./page").PageAction | import("./customers").CustomerAction>;
export declare type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
export declare type GetStateFunction = () => RootState;
