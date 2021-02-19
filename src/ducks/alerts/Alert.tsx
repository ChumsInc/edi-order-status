import * as React from "react";
import classNames from 'classnames';
import numeral from "numeral";
import {AlertType} from './index';
import Badge from "../../common-components/Badge";

export interface Props {
    alert: AlertType,
    onDismiss?: (id: number) => void,
}
const Alert:React.FC<Props> = ({alert, onDismiss, children}) => {
    const { className, color, context, count, id, message, title} = alert;
    const canDismiss = typeof onDismiss === 'function';
    const elClassName = {
        'alert-dismissible': canDismiss,
    }

    return (
        <div className={classNames('alert my-3', `alert-${color}`, className, elClassName)}>
            {!!context && (<strong className="me-1">[{context}]</strong>)}
            {title && (<strong className="me-1">{title}:</strong>)}
            {message || children || null}
            {!!count && count > 1 && (<Badge color={color || 'danger'} className="mx-3">{numeral(count).format('0,0')}</Badge>)}
            {typeof onDismiss === 'function' && <span onClick={() => onDismiss(id)} className="btn-close"/>}
        </div>
    )
}

export default Alert;
