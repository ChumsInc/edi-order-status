import {Action, AnyAction, combineReducers} from 'redux';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {onErrorAction} from "../alerts";

//actions
const customersFetch:string = 'app/customers/fetch';
const customersFetchSuccess:string = 'app/customers/fetchSuccess'
const customersFetchFailure:string = 'app/customers/fetchFailure'

const URL_CUSTOMERS = '/api/operations/shipping/edi-order-status/chums/customers';

export interface Customer {
    ARDivisionNo: string,
    CustomerNo: string,
    CustomerName: string,
}

export interface CustomerState {
    list: Customer[],
    loading: boolean,
}

const defaultState:CustomerState = {
    list: [],
    loading: false,
};

export interface CustomerAction extends AnyAction {
    payload?: {
        customers?: Customer[],
    }
}

export interface CustomerThunkAction extends ThunkAction<void, RootState, unknown, Action<string>> {

}

export const fetchCustomers = ():CustomerThunkAction =>
    async (dispatch, getState) => {
    try {
        const state = getState();
        if (state.customers.loading) {
            return;
        }
        dispatch({type: customersFetch});
        const res = await fetch(URL_CUSTOMERS, {credentials: 'same-origin'});
        const {customers} = await res.json();
        dispatch({type: customersFetchSuccess, payload: {customers}});
    } catch(err) {
        console.log("loadCustomers()", err.message);
        dispatch({type: customersFetchFailure});
        dispatch(onErrorAction(err, customersFetch));
    }
}


const list = (state = defaultState.list, action:CustomerAction) => {
    const {type, payload} = action;
    switch (type) {
    case customersFetchSuccess:
        return [...(payload?.customers || [])];
    default:
        return state;
    }
}

const loading = (state = defaultState.loading, action:CustomerAction) => {
    switch (action.type) {
    case customersFetch:
        return true;
    case customersFetchSuccess:
    case customersFetchFailure:
        return false;
    default: return state;
    }
}

export default combineReducers({
    list,
    loading,
});
