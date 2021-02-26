import { AnyAction } from 'redux';
import { RootStateOrAny } from "react-redux";
import { ActionInterface } from "../types";
export interface BasicAlertType {
    title?: string;
    message: string;
    context?: string;
    color?: string;
    className?: string | object;
}
export interface AlertType extends BasicAlertType {
    id: number;
    count: number;
}
export interface AlertListState {
    counter: number;
    list: AlertType[];
}
interface AlertAction extends ActionInterface {
    payload: {
        id?: number;
        alert?: BasicAlertType;
    };
}
export default function reducer(state: AlertListState | undefined, action: AnyAction): {
    counter: number;
    list: any[];
};
export declare function addAlertAction(alert: BasicAlertType): AlertAction;
export declare function dismissAlertAction(id: number): AlertAction;
export declare const alertSelector: (state: RootStateOrAny) => AlertType[];
export declare function onErrorAction(err: Error, context?: string): AlertAction;
export {};
