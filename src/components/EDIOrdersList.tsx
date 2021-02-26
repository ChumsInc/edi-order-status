import * as React from "react";
import {EDIOrder, OrderFilter, OrderSort, StatusPopupKey} from "../ducks/orders/types";
import {connect} from "react-redux";
import {RootState} from '../ducks';
import {fetchOrdersAction, toggleStatusPopup} from "../ducks/orders/actions";
import EDIOrdersFilter from "./EDIOrdersFilter";
import EDIOrderTable from "./EDIOrderTable";
import ErrorBoundary from "../common-components/ErrorBoundary";
import {noSelectedPopup} from "../ducks/orders/defaults";
import ProgressBar from "../common-components/ProgressBar";
import RowsPerPage from "../ducks/page/RowsPerPage";
import Pagination from "../ducks/page/Pagination";
import {setPage} from "../ducks/page";
import {fetchCustomers} from '../ducks/customers';
import {EDIOrderSortHandler} from "../ducks/orders/EDIOrderSorter";


interface StateProps {
    list: EDIOrder[],
    loading: boolean,
    filter: OrderFilter,
    statusPopup: StatusPopupKey,
    page: number,
    rowsPerPage: number,
    sort: OrderSort,
}

interface DispatchProps {
    fetchOrders: () => void,
    toggleStatusPopup: (statusPopup:StatusPopupKey) => void,
    setPage: (page:number) => void,
    fetchCustomers: () => void,
}

type Props = StateProps & DispatchProps;

const mapState = (state: RootState): StateProps => {
    const {list, loading, filter, statusPopup, sort} = state.orders;
    const {page, rowsPerPage} = state.page;
    const filteredList = list.filter(order => {
        return (!filter.ARDivisionNo || order.ARDivisionNo === filter.ARDivisionNo)
            && (!filter.CustomerNo || order.CustomerNo === filter.CustomerNo)
    })
    return {
        list: filteredList,
        loading,
        filter,
        statusPopup,
        page,
        rowsPerPage,
        sort,
    }
}

const mapDispatch = {
    fetchOrders: fetchOrdersAction,
    toggleStatusPopup: toggleStatusPopup,
    setPage: setPage,
    fetchCustomers
}

const connector = connect(mapState, mapDispatch);


class EDIOrdersList extends React.Component<Props, any> {

    constructor(props: React.ComponentProps<any>) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    componentDidMount() {
        this.props.fetchOrders();
        this.props.fetchCustomers();
    }

    onClick(ev:React.MouseEvent) {
        const target = ev.target as HTMLElement;
        if (target.closest('.status-button-select')) {
            return;
        }
        this.props.toggleStatusPopup(noSelectedPopup);
    }



    pageData() {
        const {list, page, rowsPerPage, sort} = this.props;
        const pages = Math.ceil(list.length / rowsPerPage);

        return {
            pages,
            list: EDIOrderSortHandler(list, sort)
                .filter((row, index) => Math.floor(index / rowsPerPage) === (page - 1))
        }
    }

    render() {
        const {loading, statusPopup} = this.props;
        const {list, pages} = this.pageData();

        return (
            <>
                <div onClick={this.onClick}>
                    <EDIOrdersFilter/>
                    <ProgressBar striped={true} active={true} visible={loading} />
                    <ErrorBoundary>
                        <EDIOrderTable rows={list} statusPopup={statusPopup}/>
                    </ErrorBoundary>
                </div>
                <div className="row g-3">
                    <div className="col-auto">
                        <RowsPerPage />
                    </div>
                    <div className="col-auto">
                        <Pagination pages={pages} />
                    </div>
                </div>
            </>
        )
    }
}

export default connector(EDIOrdersList);
