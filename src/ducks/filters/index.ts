import {combineReducers} from "redux";
import {ActionInterface, ActionPayload} from "chums-ducks";
import {RootState} from "../index";

export interface FilterCustomer {
    Company?: string,
    ARDivisionNo: string,
    CustomerNo: string,
}
export interface FilterPayload extends ActionPayload {
    customer?: FilterCustomer|null,
    value?: string,
    bool?: boolean,
}
export interface FilterAction extends ActionInterface {
    payload: FilterPayload,
}

export const customerChanged = 'filter/customerChanged';
export const filterPOChanged = 'filter/POChanged';
export const showCompleted = 'filter/showCompleted';
export const minDateChanged = 'filter/minDateChanged';
export const maxDateChanged = 'filter/maxDateChanged';
export const orderDateChanged = 'filter/orderDateChanged';
export const shipDateChanged = 'filter/shipDateChanged';
export const mapadocChanged = 'filter/MAPADOCChanged';

export const customerChangedAction = (customer:FilterCustomer|null):FilterAction => ({type: customerChanged, payload: {customer}});
export const showCompletedChangedAction = (bool?:boolean):FilterAction => ({type: showCompleted, payload: {bool}});
export const mapadocChangedAction = (bool?:boolean):FilterAction => ({type: mapadocChanged, payload: {bool}});
export const minDateChangedAction = (value?:string):FilterAction => ({type: minDateChanged, payload:{value}});
export const maxDateChangedAction = (value?:string):FilterAction => ({type: maxDateChanged, payload:{value}});
export const orderDateChangedAction = (value?:string):FilterAction => ({type: orderDateChanged, payload:{value}});
export const shipDateChangedAction = (value?:string):FilterAction => ({type: shipDateChanged, payload:{value}});

export const selectCustomerFilter = (state:RootState):FilterCustomer|null => state.filters.customer;
export const selectMapadocFilter = (state:RootState):boolean => state.filters.mapadoc;
export const selectShowCompletedFilter = (state:RootState):boolean => state.filters.showCompleted;
export const selectMinDateFilter = (state:RootState):string => state.filters.minDate;
export const selectMaxDateFilter = (state:RootState):string => state.filters.maxDate;
export const selectOrderDateFilter = (state:RootState):string => state.filters.orderDate;
export const selectShipDateFilter = (state:RootState):string => state.filters.shipDate;

const customerReducer = (state:FilterCustomer|null = null, action:FilterAction):FilterCustomer|null => {
    switch (action.type) {
    case customerChanged:
        return action.payload.customer || null;
    default: return state;
    }
}

export const mapadocReducer = (state:boolean = true, action:FilterAction):boolean => {
    switch (action.type) {
    case mapadocChanged:
        if (action.payload.bool !== undefined) {
            return action.payload.bool
        }
        return !state;
    default:return state;
    }
}

export const orderDateReducer = (state:string = '', action:FilterAction):string => {
    switch (action.type) {
    case orderDateChanged:
        return action.payload.value || '';
    default: return state;
    }
}

export const shipDateReducer = (state:string = '', action:FilterAction):string => {
    switch (action.type) {
    case shipDateChanged:
        return action.payload.value || '';
    default: return state;
    }
}

export const showCompletedReducer = (state:boolean = false, action:FilterAction):boolean => {
    switch (action.type) {
    case showCompleted:
        if (action.payload.bool !== undefined) {
            return action.payload.bool
        }
        return !state;
    default:return state;
    }
}

export const minDateReducer = (state:string = '', action:FilterAction): string => {
    switch (action.type) {
    case minDateChanged:
        return action.payload.value || '';
    default: return state;
    }
}

export const maxDateReducer = (state:string = '', action:FilterAction): string => {
    switch (action.type) {
    case maxDateChanged:
        return action.payload.value || '';
    default: return state;
    }
}


export default combineReducers({
    customer: customerReducer,
    mapadoc: mapadocReducer,
    orderDate: orderDateReducer,
    shipDate: shipDateReducer,
    showCompleted: showCompletedReducer,
    minDate: minDateReducer,
    maxDate: maxDateReducer,
})
