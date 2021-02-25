import React, {useState} from "react";
import classNames from "classnames";
import {EDIOrder, StatusPopupKey} from "../ducks/orders/types";
import {isPast, isThisWeek, parseISO} from 'date-fns';
import {customerKey, friendlyDate, orderKey} from "../ducks/orders/utils";
import OrderStatusButton from "./OrderStatusButton";
import numeral from "numeral";
import TextareaAutosize from 'react-textarea-autosize';
import {useDispatch} from "react-redux";
import {onChangeOrderComment, statusPopupEquality} from "../ducks/orders/actions";
import OrderCompletedButton from "./OrderCompletedButton";

interface Props {
    row: EDIOrder,
    statusPopup: StatusPopupKey,
}

const rowValues = (row: EDIOrder) => {
    const cancelDate = !row.UDF_CANCEL_DATE ? null : parseISO(row.UDF_CANCEL_DATE);
    const shipDate = !row.ShipExpireDate ? null : parseISO(row.ShipExpireDate);
    const orderDate = parseISO(row.OrderDate);
    const key = orderKey(row);

    const trClassName = {
        'table-danger': !!cancelDate && isPast(cancelDate),
        'table-warning': !!shipDate && isPast(shipDate),
    }
    return {
        cancelDate,
        shipDate,
        orderDate,
        trClassName,
        key
    }
}

const EDIOrderRow: React.FC<Props> = ({row, statusPopup}) => {
    const {cancelDate, shipDate, orderDate, trClassName, key} = rowValues(row);
    const [editComment, setEditComment] = useState(false);
    return (
        <>
            <tr className={classNames(trClassName)}>
                <td>{customerKey(row)}</td>
                <td>{row.BillToName}</td>
                <td>{row.CustomerPONo}</td>
                <td>{row.OrderStatus}</td>
                <td>{friendlyDate(orderDate)}</td>
                <td>{!!shipDate ? friendlyDate(shipDate) : '-'}</td>
                <td>{!!cancelDate ? friendlyDate(cancelDate) : '-'}</td>
                <td><OrderStatusButton order={row} type="imported" statusPopup={statusPopup}/></td>
                <td><OrderStatusButton order={row} type="inventory" statusPopup={statusPopup}/></td>
                <td><OrderStatusButton order={row} type="printed" statusPopup={statusPopup}/></td>
                <td><OrderStatusButton order={row} type="logistics" statusPopup={statusPopup}/></td>
                <td><OrderStatusButton order={row} type="work-cell" statusPopup={statusPopup}/></td>
                <td><OrderStatusButton order={row} type="picked" statusPopup={statusPopup}/></td>
                <td><OrderStatusButton order={row} type="routed" statusPopup={statusPopup}/></td>
                <td><OrderStatusButton order={row} type="asn" statusPopup={statusPopup}/></td>
                <td><OrderStatusButton order={row} type="picked-up" statusPopup={statusPopup}/></td>
                <td><OrderCompletedButton order={row}  statusPopup={statusPopup}/></td>
                <td className="right">{numeral(row.OrderCount).format('0,0')}</td>
                <td className="right">{numeral(row.OrderTotal).format('$0,0.00')}</td>
                <td className="comment-icon" onClick={() => setEditComment(true)}>
                    <span className="bi-pencil-square" />
                </td>
            </tr>
            {editComment && (
                <EDIOrderComment row={row}/>
            )}
            {!editComment && !!row.notes && (
                <tr className={classNames(trClassName)}>
                    <td colSpan={6}>&nbsp;</td>
                    <td colSpan={11}>{row.notes}</td>
                </tr>
            )}
        </>

    )
}


interface EDIOrderCommentProps {
    row: EDIOrder,
}
const EDIOrderComment: React.FC<EDIOrderCommentProps> = ({row}) => {
    const dispatch = useDispatch();
    const {trClassName} = rowValues(row);
    const [notes, setNotes] = useState(row.notes || '');

    return (
        <tr className={classNames(trClassName)}>
            <td colSpan={6}>&nbsp;</td>
            <td colSpan={11}>
                <TextareaAutosize value={notes} maxRows={3} autoFocus
                                  onChange={(ev) => setNotes(ev.target.value)}
                                  onBlur={() => dispatch(onChangeOrderComment(row, notes))}
                />
            </td>
            <td>
                <span className="bi-cloud-arrow-up-fill" />
            </td>
        </tr>
    )
}

export default EDIOrderRow;

