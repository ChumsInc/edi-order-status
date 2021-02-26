import { EDIOrder, EDIOrdersAction, OrderFilter } from "./types";
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    loading: boolean;
    saving: boolean;
    filter: OrderFilter;
    list: EDIOrder[];
    statusPopup: never;
    sort: import("./types").OrderSort;
}>, EDIOrdersAction>;
export default _default;
