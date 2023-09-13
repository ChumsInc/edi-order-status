import React, {ChangeEvent, useEffect, useState} from "react";
import {EDIOrder, OrderSortField} from "./types";
import classNames from "classnames";
import EDIOrderRow from "./EDIOrderRow";
import {orderKey} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {setSortField, toggleOrderSelected} from "./actions";
import OrderStatusTH from "./OrderStatusTH";
import OrderStatusCompletedTH from "./OrderStatusCompletedTH";
import {selectCountChecked, selectFilteredOrdersList, selectOrderSort} from "./selectors";
import {selectCustomerFilter, selectOrderDateFilter, selectShipDateFilter} from "../filters";


interface ThSortableProps {
    field: OrderSortField,
    className?: string | classNames.Argument,
    onClick: (field: OrderSortField) => void,
    children: string | React.ReactNode,
}

const ThSortable = ({field, className, onClick, children}: ThSortableProps) => {
    const sort = useSelector(selectOrderSort);
    const _className = {
        sortable: true,
        sorted: sort?.field === field,
        'sorted-asc': sort?.field === field && sort?.asc,
        'sorted-desc': sort?.field === field && !sort?.asc,
    }
    return (
        <th className={classNames(_className, className)} onClick={() => onClick(field)}>{children}</th>
    )
}

interface EDIOrderTableProps {
    rows: EDIOrder[],
}

const EDIOrderTable = ({rows}:EDIOrderTableProps) => {
    const dispatch = useDispatch();
    const sort = useSelector(selectOrderSort);
    const customer = useSelector(selectCustomerFilter);
    const shipDate = useSelector(selectShipDateFilter);
    const orderDate = useSelector(selectOrderDateFilter);
    const checkedCount = useSelector(selectCountChecked);

    const canSelectAll = !!customer && (!!shipDate || !!orderDate);
    const [selectAll, setSelectAll] = useState(false);
    const [thPopupEnabled, setTHPopupEnabled] = useState<boolean>(false);

    useEffect(() => {
        const countSelected = rows.filter(order => order.selected).length;
        setSelectAll(countSelected > 0 && countSelected === rows.length)
        setTHPopupEnabled(countSelected > 0);
    }, [rows]);

    const onClickSort = (field: OrderSortField) => {
        const nextSort = {...sort};
        if (nextSort.field === field) {
            nextSort.asc = !nextSort.asc;
        } else {
            nextSort.field = field;
            nextSort.asc = true;
        }
        dispatch(setSortField(nextSort));
    }

    const onSelectAll = (ev:ChangeEvent<HTMLInputElement>) => {
        if (!canSelectAll && ev.target.checked) {
            return;
        }
        setSelectAll(ev.target.checked);
        const selectedList = rows
            .filter(row => row.OrderStatus !== 'X')
            .map(row => orderKey(row));
        dispatch(toggleOrderSelected({list: selectedList, checked: ev.target.checked}));
    }

    return (
        <table className="table table-sm table-sticky table-hover">
            <thead>
            <tr>
                <th>
                    <div className="form-check form-check-inline">
                        <input type="checkbox" className="form-check-input" checked={selectAll}
                               disabled={!canSelectAll && checkedCount === 0}
                               onChange={onSelectAll}/>
                        {!!checkedCount && <span className="ms-1">({checkedCount})</span>}
                    </div>
                </th>
                <ThSortable field="CustomerNo" onClick={onClickSort}>Customer</ThSortable>
                <ThSortable field="BillToName" onClick={onClickSort}>Name</ThSortable>
                <ThSortable field="CustomerPONo" onClick={onClickSort}>PO #</ThSortable>
                <ThSortable field="SalesOrders" onClick={onClickSort}>SO #</ThSortable>
                <th>Status</th>
                <ThSortable field="OrderDate" onClick={onClickSort}>Order Date</ThSortable>
                <ThSortable field="ShipExpireDate" onClick={onClickSort}>Ship Date</ThSortable>
                <ThSortable field="UDF_CANCEL_DATE" onClick={onClickSort}>Cancel Date</ThSortable>
                <OrderStatusTH type="imported" enabled={thPopupEnabled}>Import</OrderStatusTH>
                <OrderStatusTH type="inventory" enabled={thPopupEnabled}>Inventory</OrderStatusTH>
                <OrderStatusTH type="printed" enabled={thPopupEnabled}>Print</OrderStatusTH>
                <OrderStatusTH type="logistics" enabled={thPopupEnabled}>Logistics</OrderStatusTH>
                <OrderStatusTH type="work-cell" enabled={thPopupEnabled}>W/C</OrderStatusTH>
                <OrderStatusTH type="picked" enabled={thPopupEnabled}>Pick</OrderStatusTH>
                <OrderStatusTH type="routed" enabled={thPopupEnabled}>Route</OrderStatusTH>
                <OrderStatusTH type="asn" enabled={thPopupEnabled}>ASN</OrderStatusTH>
                <OrderStatusTH type="picked-up" enabled={thPopupEnabled}>Picked Up</OrderStatusTH>
                <OrderStatusTH type="invoiced" enabled={thPopupEnabled}>Invoiced</OrderStatusTH>
                <OrderStatusCompletedTH type="completed" enabled={thPopupEnabled}>Completed</OrderStatusCompletedTH>
                <ThSortable field="OrderCount" className="right" onClick={onClickSort}>Orders</ThSortable>
                <ThSortable field="OrderTotal" className="right" onClick={onClickSort}>Order
                    Total</ThSortable>
                <th><span className="bi bi-sticky"/></th>
            </tr>
            </thead>
            <tbody>
            {rows.map(row => <EDIOrderRow key={orderKey(row)} row={row}/>)}
            </tbody>
        </table>
    )
}

export default EDIOrderTable;
