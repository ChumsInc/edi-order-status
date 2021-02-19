import * as React from "react";
import {useSelector, useDispatch} from 'react-redux';
import {AlertType, alertSelector, dismissAlertAction} from "./index";
import Alert from './Alert';

export interface Props {
    context?: string,
}

const AlertList:React.FC<Props> = ({context}) => {
    const list:AlertType[] = useSelector(alertSelector).filter(alert => !context || alert.context === context);
    const dispatch = useDispatch();
    return (
        <div>
            {list.map(alert => <Alert key={alert.id} alert={alert} onDismiss={(id) => dispatch(dismissAlertAction(id))} />)}
        </div>
    )
}

export default AlertList;
