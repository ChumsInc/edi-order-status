import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {fetchOrdersAction, toggleStatusPopupAction} from "./actions";
import EDIOrdersFilter from "./EDIOrdersFilter";
import EDIOrderTable from "./EDIOrderTable";
import {ErrorBoundary} from "chums-components";
import {noSelectedPopup} from "./defaults";
import AutoRefreshCheckbox from "./AutoRefreshCheckbox";
import {selectFilteredOrdersList, selectOrdersListLength, selectOrdersLoading, selectStatusPopup} from "./selectors";
import {addPageSetAction, ConnectedPager, selectPagedData} from "chums-connected-components";
import {appStorage, STORAGE_KEYS} from "../../appStorage";
import {useAppDispatch} from "../../app/hooks";

const pageKey = 'edi-orders-list';

const EDIOrdersList: React.FC = () => {
    const dispatch = useAppDispatch();
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

    const onChangeRowsPerPage = (rowsPerPage: number) => {
        appStorage.setItem(STORAGE_KEYS.ROWS_PER_PAGE, rowsPerPage || 25);
    }

    return (
        <>
            <div onClick={onClick}>
                <EDIOrdersFilter/>
                <ErrorBoundary>
                    <EDIOrderTable rows={pagedOrdersList}/>
                </ErrorBoundary>
            </div>
            <div className="row g-3 align-items-end">
                <div className="col-auto">
                    <AutoRefreshCheckbox/>
                </div>
                <div className="col-auto">
                    <ConnectedPager pageSetKey={pageKey} dataLength={orders.length}
                                    onChangeRowsPerPage={onChangeRowsPerPage} filtered={orders.length !== listLength}/>
                </div>
            </div>
        </>
    )
}

export default EDIOrdersList
