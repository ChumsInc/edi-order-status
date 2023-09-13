import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {loadOrders} from "./actions";
import EDIOrdersFilter from "./EDIOrdersFilter";
import EDIOrderTable from "./EDIOrderTable";
import {LocalStore, TablePagination} from "chums-components";
import AutoRefreshCheckbox from "./AutoRefreshCheckbox";
import {selectFilteredOrdersList} from "./selectors";
import {STORAGE_KEYS} from "../../appStorage";
import {useAppDispatch} from "../../app/hooks";
import {ErrorBoundary} from 'react-error-boundary';
import ErrorBoundaryFallbackAlert from "../../common-components/ErrorBoundaryFallbackAlert";

const pageKey = 'edi-orders-list';

const EDIOrdersList: React.FC = () => {
    const dispatch = useAppDispatch();
    const orders = useSelector(selectFilteredOrdersList);
    // const popup = useSelector(selectStatusPopup);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(LocalStore.getItem<number>(STORAGE_KEYS.ROWS_PER_PAGE, 25) ?? 25)

    useEffect(() => {
        dispatch(loadOrders());
    }, [])

    useEffect(() => {
        setPage(0);
    }, [orders]);

    // const onClick = (ev: React.MouseEvent) => {
    //     const target = ev.target as HTMLElement;
    //     if (!popup?.key || target.closest('.status-button-select')) {
    //         return;
    //     }
    //     dispatch(toggleStatusPopup(null));
    // }

    const onChangeRowsPerPage = (rowsPerPage: number) => {
        LocalStore.setItem(STORAGE_KEYS.ROWS_PER_PAGE, rowsPerPage || 25);
        setRowsPerPage(rowsPerPage);
    }

    return (
        <>
            <div>
                <EDIOrdersFilter/>
                <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
                    <EDIOrderTable rows={orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}/>
                </ErrorBoundary>
            </div>
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
        </>
    )
}

export default EDIOrdersList
