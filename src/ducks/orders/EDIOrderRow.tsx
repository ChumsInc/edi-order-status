import React, {useState} from "react";
import classNames from "classnames";
import {EDIOrder} from "./types";
import {isPast, isSameDay, parseISO} from 'date-fns';
import {customerKey, friendlyDate, orderKey} from "./utils";
import OrderStatusButton from "./OrderStatusButton";
import numeral from "numeral";
import TextareaAutosize from 'react-textarea-autosize';
import {onChangeOrderCommentAction} from "./actions";
import OrderCompletedButton from "./OrderCompletedButton";
import OrderSelectCheckbox from "./OrderSelectCheckbox";
import {useAppDispatch} from "../../app/hooks";

interface Props {
    row: EDIOrder,
}

const rowValues = (row: EDIOrder) => {
    const cancelDate = !row.UDF_CANCEL_DATE ? null : parseISO(row.UDF_CANCEL_DATE);
    const shipDate = !row.ShipExpireDate ? null : parseISO(row.ShipExpireDate);
    const lastInvoiceDate = !row.LastInvoiceDate ? null : parseISO(row.LastInvoiceDate);
    const orderDate = parseISO(row.OrderDate);
    const key = orderKey(row);

    const trClassName = {
        'table-danger': !lastInvoiceDate && !!cancelDate && isPast(cancelDate) && !isSameDay(cancelDate, new Date()),
        'table-warning': !lastInvoiceDate && !!shipDate && (isPast(shipDate) || (!!cancelDate && isSameDay(cancelDate, new Date()))),
        'table-success': !!lastInvoiceDate,
        'edi-order-row--has-comment': !!row.notes,
    }
    return {
        cancelDate,
        shipDate,
        orderDate,
        lastInvoiceDate,
        trClassName,
        key
    }
}

const CustomerItemLink: React.FC<{ row: EDIOrder }> = ({row}) => {
    const href = `/reports/production/customer-open-items?company=${encodeURIComponent(row.Company)}&customer=${encodeURIComponent(row.ARDivisionNo)}-${encodeURIComponent(row.CustomerNo)}`;
    return (
        <a href={href} target="_blank">{customerKey(row)}</a>
    )
}

const EDIOrderRow: React.FC<Props> = ({row}) => {
    const {cancelDate, shipDate, orderDate, trClassName, lastInvoiceDate} = rowValues(row);
    const [editComment, setEditComment] = useState(false);
    return (
        <>
            <tr className={classNames(trClassName)}>
                <th><OrderSelectCheckbox order={row}/></th>
                <td><CustomerItemLink row={row}/></td>
                <td>{row.BillToName}</td>
                <td>{row.CustomerPONo}</td>
                <td>{row.OrderCount === 1 ? row.SalesOrders : `(${row.OrderCount})`}</td>
                <td>{row.OrderStatus}</td>
                <td>{friendlyDate(orderDate)}</td>
                <td>{!!shipDate ? friendlyDate(shipDate) : (!!lastInvoiceDate ? friendlyDate(lastInvoiceDate) : '-')}</td>
                <td>{!!cancelDate ? friendlyDate(cancelDate) : '-'}</td>
                <td><OrderStatusButton order={row} type="imported"/></td>
                <td><OrderStatusButton order={row} type="inventory"/></td>
                <td><OrderStatusButton order={row} type="printed"/></td>
                <td><OrderStatusButton order={row} type="logistics"/></td>
                <td><OrderStatusButton order={row} type="work-cell"/></td>
                <td><OrderStatusButton order={row} type="picked"/></td>
                <td><OrderStatusButton order={row} type="routed"/></td>
                <td><OrderStatusButton order={row} type="asn"/></td>
                <td><OrderStatusButton order={row} type="picked-up"/></td>
                <td><OrderStatusButton order={row} type="invoiced"/></td>
                <td><OrderCompletedButton order={row}/></td>
                <td className="right">
                    {numeral(row.InvoiceCount).format('0,0')} / {numeral(row.OrderCount).format('0,0')}
                </td>
                <td className="right">{numeral(row.OrderTotal).format('$0,0.00')}</td>
                <td className="comment-icon" onClick={() => setEditComment(true)}>
                    <span className="bi-pencil-square"/>
                </td>
            </tr>
            {editComment && (
                <EDIOrderComment row={row} onSave={() => setEditComment(false)}/>
            )}
            {!editComment && !!row.notes && (
                <tr className={classNames('edi-order-row--comment', trClassName)}>
                    <td colSpan={7}>&nbsp;</td>
                    <td colSpan={14} className="edi-order-row--comment-text">{row.notes}</td>
                </tr>
            )}
        </>

    )
}


interface EDIOrderCommentProps {
    row: EDIOrder,
    onSave: () => void,
}

const EDIOrderComment: React.FC<EDIOrderCommentProps> = ({row, onSave}) => {
    const dispatch = useAppDispatch();
    const {trClassName} = rowValues(row);
    const [notes, setNotes] = useState(row.notes || '');

    const blurHandler = () => {
        dispatch(onChangeOrderCommentAction(row, notes));
        onSave();
    }

    return (
        <tr className={classNames(trClassName)}>
            <td colSpan={7}>&nbsp;</td>
            <td colSpan={13}>
                <TextareaAutosize value={notes} maxRows={3} autoFocus
                                  className="form-control form-control-sm"
                                  onChange={(ev) => setNotes(ev.target.value)}
                                  onBlur={blurHandler}
                />
            </td>
            <td>
                <span className="bi-cloud-arrow-up-fill"/>
            </td>
        </tr>
    )
}

export default EDIOrderRow;

