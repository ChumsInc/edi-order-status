import React, {ReactChildren, useState} from "react";
import {EDIOrder, StatusPopupKey} from "../ducks/orders/types";
import {EDIOrderSortHandler} from "../ducks/orders/EDIOrderSorter";
import classNames from "classnames";
import EDIOrderRow from "./EDIOrderRow";
import {orderKey} from "../ducks/orders/utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../ducks";
import {setSortField} from "../ducks/orders/actions";

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
    statusPopup: StatusPopupKey,
}

const EDIOrderTable: React.FC<Props> = ({rows, statusPopup}) => {
    const dispatch = useDispatch();
    const {sort} = useSelector((state:RootState) => state.orders);
    const onClickSort = (field: string) => {
        dispatch(setSortField(field));
    }
    return (
        <table className="table table-sm table-sticky table-hover">
            <thead>
            <tr>
                <ThSortable field="CustomerNo" sort={sort} onClick={onClickSort}>Customer</ThSortable>
                <ThSortable field="BillToName" sort={sort} onClick={onClickSort}>Name</ThSortable>
                <ThSortable field="CustomerPONo" sort={sort} onClick={onClickSort}>PO #</ThSortable>
                <th>Status</th>
                <ThSortable field="OrderDate" sort={sort} onClick={onClickSort}>Order Date</ThSortable>
                <ThSortable field="ShipExpireDate" sort={sort} onClick={onClickSort}>Ship Date</ThSortable>
                <ThSortable field="UDF_CANCEL_DATE" sort={sort} onClick={onClickSort}>Cancel Date</ThSortable>
                <th>Import</th>
                <th>Inventory</th>
                <th>Print</th>
                <th>Logistics</th>
                <th>W/C</th>
                <th>Pick</th>
                <th>Route</th>
                <th>ASN</th>
                <th>Picked Up</th>
                <th>Completed</th>
                <th>Invoiced</th>
                <ThSortable field="OrderCount" className="right" sort={sort} onClick={onClickSort}>Orders</ThSortable>
                <ThSortable field="OrderTotal" className="right" sort={sort} onClick={onClickSort}>Order
                    Total</ThSortable>
                <th><span className="bi bi-sticky"/></th>
            </tr>
            </thead>
            <tbody>
            {rows.map(row => <EDIOrderRow key={orderKey(row)} row={row} statusPopup={statusPopup}/>)}
            </tbody>
        </table>
    )
}

export default EDIOrderTable;
