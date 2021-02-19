import {AnyAction, } from 'redux';
import {RootStateOrAny} from "react-redux";
import {ActionInterface} from "../types";

const ADD_ALERT: string = 'app/alerts/alertAdded';
const DISMISS_ALERT: string = 'app/alerts/alertDismissed';

export interface BasicAlertType {
    title?: string,
    message: string,
    context?: string,
    color?: string,
    className?: string | object,
}

export interface AlertType extends BasicAlertType {
    id: number,
    count: number,
}

export interface AlertListState {
    counter: number,
    list: AlertType[],
}

interface AlertAction extends ActionInterface {
    payload: {
        id?: number,
        alert?: BasicAlertType,
    }
}

const initialState: AlertListState = {counter: 0, list: []}

export default function reducer(state: AlertListState = initialState, action: AnyAction) {
    const {type, payload} = action;
    const {counter, list} = state;
    switch (type) {
        case ADD_ALERT: {
            const {alert} = payload;
            alert.id = counter;
            alert.count = 0;

            const [{id = alert.id, count = alert.count} = {}] = list.filter(a => a.context === alert.context);
            return {
                ...state,
                counter: counter + 1,
                list: [
                    ...list.filter(a => a.context !== alert.context),
                    {...alert, id, count: count + 1},
                ]
            }
        }
        case DISMISS_ALERT:
            const {id} = payload;
            return {
                ...state,
                list: list.filter(alert => alert.id !== id),
            }
        default:
            return state;
    }
}

export function addAlertAction(alert: BasicAlertType): AlertAction {
    return {
        type: ADD_ALERT,
        payload: {
            alert: {...alert, color: alert.color || 'danger'}
        },
    }
}

export function dismissAlertAction(id:number): AlertAction {
    return {
        type: DISMISS_ALERT,
        payload: {
            id
        }
    }
}

export const alertSelector = (state:RootStateOrAny):AlertType[] => {
    return state.alerts.list;
}

export function onErrorAction(err:Error, context?: string): AlertAction {
    return {
        type: ADD_ALERT,
        payload: {
            alert: {message: err.message, title: err.name, context}
        }
    }
}
