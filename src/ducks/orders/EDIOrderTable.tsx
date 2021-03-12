import React, {ReactChildren, useState} from "react";
import {EDIOrder} from "./types";
import classNames from "classnames";
import EDIOrderRow from "./EDIOrderRow";
import {orderKey} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../index";
import {selectOrders, setSortField} from "./actions";
import OrderStatusTH from "./OrderStatusTH";

interface ThProps {
    field: string,
    sort: {
        field: string,
        asc: boolean,
    },
    className?: string | object,
    children: string | ReactChildren,
    onClick: (field: string) => void,
}

const ThSortable: React.FC<ThProps> = ({field, sort, className, children, onClick}) => {
    const _className = {
        sortable: true,
        sorted: sort.field === field,
        'sorted-asc': sort.field === field && sort.asc,
        'sorted-desc': sort.field === field && !sort.asc,
    }
    return (
        <th className={classNames(_className, className)} onClick={() => onClick(field)}>{children}</th>
    )
}

interface Props {
    rows: EDIOrder[],
}

const EDIOrderTable: React.FC<Props> = ({rows}) => {
    const dispatch = useDispatch();
    const {sort} = useSelector((state: RootState) => state.orders);
    const {CustomerNo, ShipExpireDate, OrderDate} = useSelector((state: RootState) => state.orders.filter);
    const thPopupEnabled = useSelector((state: RootState) => !!state.orders.list.filter(order => order.selected).length);
    const canSelectAll = !!CustomerNo && (!!ShipExpireDate || !!OrderDate);
    const [selectAll, setSelectAll] = useState(false);
    const onClickSort = (field: string) => {
        dispatch(setSortField(field));
    }
    const onSelectAll = () => {
        setSelectAll(!selectAll);
        const selectedList = rows.map(row => orderKey(row));
        dispatch(selectOrders(selectedList, !selectAll));
    }

    return (
        <table className="table table-sm table-sticky table-hover">
            <thead>
            <tr>
                <th>
                    {canSelectAll && (
                        <div className="form-check form-check-inline">
                            <input type="checkbox" className="form-check-input" checked={selectAll}
                                   onChange={onSelectAll}/>
                        </div>
                    )}
                </th>
                <ThSortable field="CustomerNo" sort={sort} onClick={onClickSort}>Customer</ThSortable>
                <ThSortable field="BillToName" sort={sort} onClick={onClickSort}>Name</ThSortable>
                <ThSortable field="CustomerPONo" sort={sort} onClick={onClickSort}>PO #</ThSortable>
                <th>Status</th>
                <ThSortable field="OrderDate" sort={sort} onClick={onClickSort}>Order Date</ThSortable>
                <ThSortable field="ShipExpireDate" sort={sort} onClick={onClickSort}>Ship Date</ThSortable>
                <ThSortable field="UDF_CANCEL_DATE" sort={sort} onClick={onClickSort}>Cancel Date</ThSortable>
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
                <OrderStatusTH type="completed" enabled={thPopupEnabled}>Completed</OrderStatusTH>
                <ThSortable field="OrderCount" className="right" sort={sort} onClick={onClickSort}>Orders</ThSortable>
                <ThSortable field="OrderTotal" className="right" sort={sort} onClick={onClickSort}>Order
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
