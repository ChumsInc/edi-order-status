import {combineReducers} from 'redux';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {ActionInterface, ActionPayload} from "chums-connected-components";
import {fetchJSON} from "chums-components";

//actions
const customersFetch: string = 'app/customers/fetch';
const customersFetchSuccess: string = 'app/customers/fetchSuccess'
const customersFetchFailure: string = 'app/customers/fetchFailure'

const URL_CUSTOMERS = '/api/operations/shipping/edi-order-status/chums/customers';

export interface Customer {
    ARDivisionNo: string,
    CustomerNo: string,
    CustomerName: string,
    isMAPADOC: boolean,
}

export interface CustomerState {
    list: Customer[],
    loading: boolean,
}

const defaultState: CustomerState = {
    list: [],
    loading: false,
};

export interface CustomerPayload extends ActionPayload {
    customers?: Customer[],
}

export interface CustomerAction extends ActionInterface {
    payload?: CustomerPayload
}

export interface CustomerThunkAction extends ThunkAction<any, RootState, unknown, CustomerAction> {
}

export const fetchCustomers = (): CustomerThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectCustomersLoading(state)) {
                return;
            }
            dispatch({type: customersFetch});
            const {customers} = await fetchJSON(URL_CUSTOMERS);
            dispatch({type: customersFetchSuccess, payload: {customers}});
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("loadCustomers()", err.message);
                return dispatch({type: customersFetchFailure, payload: {error: err, context: customersFetch}});
            }
            dispatch({type: customersFetchFailure});
        }
    }

export const selectCustomerList = (state: RootState) => state.customers.list;
export const selectCustomersLoading = (state: RootState) => state.customers.loading;
export const selectCustomersLoaded = (state: RootState) => state.customers.loaded;

const listReducer = (state = defaultState.list, action: CustomerAction): Customer[] => {
    const {type, payload} = action;
    switch (type) {
    case customersFetchSuccess:
        return [...(payload?.customers || [])];
    default:
        return state;
    }
}

const loadingReducer = (state = defaultState.loading, action: CustomerAction): boolean => {
    switch (action.type) {
    case customersFetch:
        return true;
    case customersFetchSuccess:
    case customersFetchFailure:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = false, action: CustomerAction): boolean => {
    switch (action.type) {
    case customersFetchSuccess:
        return true;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
});
