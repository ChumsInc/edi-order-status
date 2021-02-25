import * as React from "react";
import {EDIOrder, OrderFilter, StatusPopupKey} from "../ducks/orders/types";
import {connect} from "react-redux";
import {RootState} from '../ducks';
import {fetchOrdersAction} from "../ducks/orders/actions";
import EDIOrdersFilter from "./EDIOrdersFilter";
import EDIOrderTable from "./EDIOrderTable";
import ErrorBoundary from "../common-components/ErrorBoundary";


interface StateProps {
    list: EDIOrder[],
    loading: boolean,
    filter: OrderFilter,
    statusPopup: StatusPopupKey,
}

interface DispatchProps {
    fetchOrders: () => void,
}

type Props = StateProps & DispatchProps;

const mapState = (state: RootState): StateProps => {
    const {list, loading, filter, statusPopup} = state.orders;
    const filteredList = list.filter(order => {
        return (!filter.ARDivisionNo || order.ARDivisionNo === filter.ARDivisionNo)
            && (!filter.CustomerNo || order.CustomerNo === filter.CustomerNo)
    })
    return {
        list: filteredList,
        loading,
        filter,
        statusPopup,
    }
}

const mapDispatch = {
    fetchOrders: fetchOrdersAction,
}

const connector = connect(mapState, mapDispatch);

interface stateProps {
    page: number,
    rowsPerPage: number,
}

class EDIOrdersList extends React.Component<Props, any> {

    state: stateProps = {
        page: 1,
        rowsPerPage: 25,
    }

    constructor(props: React.ComponentProps<any>) {
        super(props);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
    }


    componentDidMount() {
        this.props.fetchOrders();
    }

    componentDidUpdate(prevProps: Props, prevState: stateProps) {
        if (this.state.page !== 1 && Object.values(prevProps).join('/') !== Object.values(this.props).join('/')) {
            this.setState({page: 1});
        }
    }


    onChangePage(page: number) {
        this.setState({page});
    }

    onChangeRowsPerPage(rowsPerPage: number) {
        this.setState({rowsPerPage, page: 1});
    }

    render() {
        const {list, loading, statusPopup} = this.props;
        const {page, rowsPerPage} = this.state;
        return (
            <div>
                <EDIOrdersFilter/>
                {loading && <div>loading</div>}
                <ErrorBoundary>
                    <EDIOrderTable rows={list} statusPopup={statusPopup}/>
                </ErrorBoundary>
            </div>
        )
    }
}

export default connector(EDIOrdersList);
