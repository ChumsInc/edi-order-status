import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {loadOrders} from "./actions";
import EDIOrdersFilter from "./EDIOrdersFilter";
import EDIOrderTable from "./EDIOrderTable";
import {Alert, LocalStore, TablePagination} from "chums-components";
import AutoRefreshCheckbox from "./AutoRefreshCheckbox";
import {selectFilteredOrdersList, selectOrdersLoading} from "./selectors";
import {STORAGE_KEYS} from "../../storage-keys";
import {useAppDispatch} from "../../app/configureStore";
import {ErrorBoundary} from 'react-error-boundary';
import ErrorBoundaryFallbackAlert from "../../common-components/ErrorBoundaryFallbackAlert";

const EDIOrdersList: React.FC = () => {
    const dispatch = useAppDispatch();
    const orders = useSelector(selectFilteredOrdersList);
    const loading = useSelector(selectOrdersLoading);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(LocalStore.getItem<number>(STORAGE_KEYS.ROWS_PER_PAGE, 25) ?? 25)

    useEffect(() => {
        dispatch(loadOrders());
    }, [])

    useEffect(() => {
        setPage(0);
    }, [orders]);

    const onChangeRowsPerPage = (rowsPerPage: number) => {
        LocalStore.setItem(STORAGE_KEYS.ROWS_PER_PAGE, rowsPerPage || 25);
        setRowsPerPage(rowsPerPage);
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <div>
                <EDIOrdersFilter/>
                <EDIOrderTable rows={orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}/>
            </div>
            {!loading && !orders.length && (
                <Alert color="warning">There are no open orders for this customer.</Alert>
            )}
            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <AutoRefreshCheckbox/>
                </div>
                <div className="col-auto">
                    <TablePagination bsSize="sm" showFirst showLast
                                     page={page} onChangePage={setPage} rowsPerPage={rowsPerPage}
                                     onChangeRowsPerPage={onChangeRowsPerPage} count={orders.length}/>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default EDIOrdersList
