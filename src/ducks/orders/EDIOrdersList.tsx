import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {loadOrders} from "./actions";
import EDIOrderTable from "./EDIOrderTable";
import {LocalStore, TablePagination} from "chums-components";
import AutoRefreshCheckbox from "./AutoRefreshCheckbox";
import {selectFilteredOrdersList, selectOrdersLoading} from "./selectors";
import {STORAGE_KEYS} from "../../storage-keys";
import {useAppDispatch} from "../../app/configureStore";
import {ErrorBoundary} from 'react-error-boundary';
import ErrorBoundaryFallbackAlert from "../../common-components/ErrorBoundaryFallbackAlert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Show01TEST from "../customers/Show01TESTToggle";

const EDIOrdersList = () => {
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
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert} fallback={undefined}>
            <EDIOrderTable rows={orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}/>
            {loading === 'idle' && !orders.length && (
                <Alert color="warning">There are no open orders for this customer.</Alert>
            )}
            <Row className="g-3 align-items-baseline">
                <Col xs="auto">
                    <AutoRefreshCheckbox/>
                </Col>
                <Col xs="auto">
                    <Show01TEST/>
                </Col>
                <Col/>
                <Col xs="auto">
                    <TablePagination bsSize="sm" showFirst showLast
                                     page={page} onChangePage={setPage} rowsPerPage={rowsPerPage}
                                     onChangeRowsPerPage={onChangeRowsPerPage} count={orders.length}/>
                </Col>
            </Row>
        </ErrorBoundary>
    )
}

export default EDIOrdersList
