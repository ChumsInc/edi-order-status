import * as React from "react";
import { EDIOrder, OrderFilter, OrderSort, StatusPopupKey } from "./types";
interface StateProps {
    list: EDIOrder[];
    loading: boolean;
    filter: OrderFilter;
    page: number;
    rowsPerPage: number;
    sort: OrderSort;
}
interface DispatchProps {
    fetchOrders: () => void;
    toggleStatusPopup: (statusPopup: StatusPopupKey) => void;
    setPage: (page: number) => void;
    fetchCustomers: () => void;
}
declare type Props = StateProps & DispatchProps;
declare class EDIOrdersList extends React.Component<Props, any> {
    constructor(props: React.ComponentProps<any>);
    componentDidMount(): void;
    onClick(ev: React.MouseEvent): void;
    pageData(): {
        pages: number;
        list: EDIOrder[];
    };
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof EDIOrdersList, Pick<React.ClassAttributes<EDIOrdersList> & StateProps & DispatchProps, "ref" | "key">>;
export default _default;
