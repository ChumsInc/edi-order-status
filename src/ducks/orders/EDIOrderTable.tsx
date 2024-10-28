import React, {ChangeEvent, useEffect, useState} from "react";
import {EDIOrder} from "chums-types";
import classNames from "classnames";
import EDIOrderRow from "./EDIOrderRow";
import {orderKey} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {setSortField, toggleOrderSelected} from "./actions";
import OrderStatusTH from "./OrderStatusTH";
import OrderStatusCompletedTH from "./OrderStatusCompletedTH";
import {selectCountChecked, selectOrderSort} from "./selectors";
import {selectCustomerFilter, selectOrderDateFilter, selectShipDateFilter} from "../filters";


interface ThSortableProps {
    field: keyof EDIOrder,
    className?: string | classNames.Argument,
    onClick: (field: keyof EDIOrder) => void,
    children: string | React.ReactNode,
}

const ThSortable = ({field, className, onClick, children}: ThSortableProps) => {
    const sort = useSelector(selectOrderSort);
    const _className = {
        sortable: true,
        sorted: sort?.field === field,
        'sorted-asc': sort?.field === field && sort?.ascending,
        'sorted-desc': sort?.field === field && !sort?.ascending,
    }
    return (
        <th className={classNames(_className, className)} onClick={() => onClick(field)}>{children}</th>
    )
}

interface EDIOrderTableProps {
    rows: EDIOrder[],
}

const EDIOrderTable = ({rows}: EDIOrderTableProps) => {
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

    const onClickSort = (field: keyof EDIOrder) => {
        const nextSort = {...sort};
        if (nextSort.field === field) {
            nextSort.ascending = !nextSort.ascending;
        } else {
            nextSort.field = field;
            nextSort.ascending = true;
        }
        dispatch(setSortField(nextSort));
    }

    const onSelectAll = (ev: ChangeEvent<HTMLInputElement>) => {
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
                <OrderStatusTH statusCode="imported" enabled={thPopupEnabled}>Import</OrderStatusTH>
                <OrderStatusTH statusCode="inventory" enabled={thPopupEnabled}>Inventory</OrderStatusTH>
                <OrderStatusTH statusCode="printed" enabled={thPopupEnabled}>Print</OrderStatusTH>
                <OrderStatusTH statusCode="logistics" enabled={thPopupEnabled}>Logistics</OrderStatusTH>
                <OrderStatusTH statusCode="ucc" enabled={thPopupEnabled}>UCC</OrderStatusTH>
                <OrderStatusTH statusCode="work-cell" enabled={thPopupEnabled}>W/C</OrderStatusTH>
                <OrderStatusTH statusCode="picked" enabled={thPopupEnabled}>Pick</OrderStatusTH>
                <OrderStatusTH statusCode="routed" enabled={thPopupEnabled}>Route</OrderStatusTH>
                <OrderStatusTH statusCode="asn" enabled={thPopupEnabled}>ASN</OrderStatusTH>
                <OrderStatusTH statusCode="sps-invoiced" enabled={thPopupEnabled}>SPS Invoice</OrderStatusTH>
                <OrderStatusCompletedTH statusCode="completed" enabled={thPopupEnabled}>Completed</OrderStatusCompletedTH>
                <ThSortable field="OrderCount" className="right" onClick={onClickSort}>Invoiced</ThSortable>
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
