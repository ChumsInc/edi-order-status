import * as React from "react";
import { AlertType } from './index';
export interface Props {
    alert: AlertType;
    onDismiss?: (id: number) => void;
}
declare const Alert: React.FC<Props>;
export default Alert;
