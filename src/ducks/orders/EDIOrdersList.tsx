import React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrdersAction, toggleStatusPopupAction} from "./actions";
import EDIOrdersFilter from "./EDIOrdersFilter";
import EDIOrderTable from "./EDIOrderTable";
import ErrorBoundary from "../../common-components/ErrorBoundary";
import {noSelectedPopup} from "./defaults";
import ProgressBar from "../../common-components/ProgressBar";
import AutoRefreshCheckbox from "./AutoRefreshCheckbox";
import {selectFilteredOrdersList, selectOrdersListLength, selectOrdersLoading, selectStatusPopup} from "./selectors";
import {addPageSetAction, PaginationDuck, RowsPerPageDuck, selectPagedData} from "chums-ducks";
import {appStorage, STORAGE_KEYS} from "../../appStorage";

const pageKey = 'edi-orders-list';

const EDIOrdersList: React.FC = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectFilteredOrdersList);
    const pagedOrdersList = useSelector(selectPagedData(pageKey, orders));
    const listLength = useSelector(selectOrdersListLength);
    const loading = useSelector(selectOrdersLoading);
    const popup = useSelector(selectStatusPopup);

    useEffect(() => {
        const rowsPerPage = appStorage.getItem(STORAGE_KEYS.ROWS_PER_PAGE) || 25;
        dispatch(addPageSetAction({key: pageKey, rowsPerPage}));
        dispatch(fetchOrdersAction());
    }, [])

    const onClick = (ev: React.MouseEvent) => {
        const target = ev.target as HTMLElement;
        if (!popup.key || target.closest('.status-button-select')) {
            return;
        }
        dispatch(toggleStatusPopupAction(noSelectedPopup));
    }

    const onChangeRowsPerPage = (rowsPerPage:number) => {
        appStorage.setItem(STORAGE_KEYS.ROWS_PER_PAGE, rowsPerPage || 25);
    }

    return (
        <>
            <div onClick={onClick}>
                <EDIOrdersFilter/>
                <div className="mb-1">
                    <ProgressBar striped={true} active={true} visible={loading}/>
                </div>
                <ErrorBoundary>
                    <EDIOrderTable rows={pagedOrdersList}/>
                </ErrorBoundary>
            </div>
            <div className="row g-3 align-items-end">
                <div className="col-auto">
                    <AutoRefreshCheckbox/>
                </div>
                <div className="col-auto">
                    <RowsPerPageDuck pageKey={pageKey} onChange={onChangeRowsPerPage}/>
                </div>
                <div className="col-auto">
                    <PaginationDuck pageKey={pageKey} dataLength={orders.length}
                                    filtered={orders.length !== listLength}/>
                </div>
            </div>
        </>
    )
}

export default EDIOrdersList
