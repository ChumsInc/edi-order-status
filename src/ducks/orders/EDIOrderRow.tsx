import React, {useState} from "react";
import classNames from "classnames";
import {EDIOrder} from "./types";
import {customerKey, friendlyDate, orderKey} from "./utils";
import OrderStatusButton from "./OrderStatusButton";
import numeral from "numeral";
import TextareaAutosize from 'react-textarea-autosize';
import {saveOrderComment} from "./actions";
import OrderCompletedButton from "./OrderCompletedButton";
import OrderSelectCheckbox from "./OrderSelectCheckbox";
import {useAppDispatch} from "../../app/configureStore";
import dayjs from "dayjs";

interface Props {
    row: EDIOrder,
}

export interface RowValues {
    cancelDate: dayjs.Dayjs;
    shipDate: dayjs.Dayjs;
    orderDate: dayjs.Dayjs;
    lastInvoiceDate: dayjs.Dayjs;
    trClassName: classNames.Argument;
    key: string;
}
const rowValues = (row: EDIOrder):RowValues => {
    const key = orderKey(row);

    const djCancelDate = dayjs(row.UDF_CANCEL_DATE);
    const djShipDate = dayjs(row.ShipExpireDate);
    const djInvoiceDate = dayjs(row.LastInvoiceDate);
    const djOrderDate = dayjs(row.OrderDate);

    const trClassName = {
        'table-danger': !djInvoiceDate.isValid() && djCancelDate.isValid() && djCancelDate.startOf('day').isBefore(new Date()) && !djCancelDate.isSame(new Date(), 'day'),
        'table-warning': !djInvoiceDate.isValid() && djShipDate.isValid() && (djShipDate.isBefore(new Date(), 'day') || (djCancelDate.isValid() && djCancelDate.isSame(new Date(), 'day'))),
        'table-success': djInvoiceDate.isValid(),
        'edi-order-row--has-comment': !!row.notes,
    }
    return {
        cancelDate: djCancelDate,
        shipDate: djShipDate,
        orderDate: djOrderDate,
        lastInvoiceDate: djInvoiceDate,
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
                <td className="text-center"><OrderStatusButton order={row} type="imported"/></td>
                <td className="text-center"><OrderStatusButton order={row} type="inventory"/></td>
                <td className="text-center"><OrderStatusButton order={row} type="printed"/></td>
                <td className="text-center"><OrderStatusButton order={row} type="logistics"/></td>
                <td className="text-center"><OrderStatusButton order={row} type="ucc"/></td>
                <td className="text-center"><OrderStatusButton order={row} type="work-cell"/></td>
                <td className="text-center"><OrderStatusButton order={row} type="picked"/></td>
                <td className="text-center"><OrderStatusButton order={row} type="routed"/></td>
                <td className="text-center"><OrderStatusButton order={row} type="asn"/></td>
                <td className="text-center"><OrderStatusButton order={row} type="sps-invoiced"/></td>
                <td className="text-center"><OrderCompletedButton order={row}/></td>
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
                    <td colSpan={13} className="edi-order-row--comment-text">
                        <span className="bi-chat-quote-fill me-3" />
                        {row.notes}
                    </td>
                    <td colSpan={3}>&nbsp;</td>
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
        dispatch(saveOrderComment({salesOrder: row, comment: notes}));
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

