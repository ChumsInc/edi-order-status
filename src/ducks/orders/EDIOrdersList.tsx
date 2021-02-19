import * as React from "react";
import {EDIOrder} from "./types";
import {connect, useSelector} from "react-redux";
import {RootState} from '../index';
import {fetchOrdersAction} from "./actions";
import SortableTable from "../../common-components/SortableTable";
import {ediOrdersFields} from "./EDIOrderListFields";


interface StateProps {
    list: EDIOrder[],
    loading: boolean,
}

interface DispatchProps {
    fetchOrders: () => void,
}

type Props = StateProps & DispatchProps;

const mapState = (state: RootState): StateProps => ({
    list: state.orders.list,
    loading: state.orders.loading,
})

const mapDispatch = {
    fetchOrders: fetchOrdersAction,
}

const connector = connect(mapState, mapDispatch);

const listSelector = (state: RootState): StateProps => {
    return {
        list: state.orders.list,
        loading: state.orders.loading,
    };
}



class EDIOrdersList extends React.Component<Props, any> {
    componentDidMount() {
        this.props.fetchOrders();
    }

    render() {
        const {list, loading} = this.props;
        return (
            <div>
                <div>Orders: {list.length}</div>
                {loading && <div>loading</div>}
                <SortableTable fields={ediOrdersFields} data={list} key="id" />
            </div>
        )
    }
}

export default connector(EDIOrdersList);
