import {RootState} from "../../app/configureStore";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {fetchCustomers} from "./api";
import {customerSorter} from "./utils";
import {EDICustomer} from "chums-types";
import {customerKey} from "../orders/utils";

export interface CustomerState {
    list: EDICustomer[],
    loading: boolean,
    loaded: boolean;
    showO1TEST: boolean;
}

const defaultState: CustomerState = {
    list: [],
    loading: false,
    loaded: false,
    showO1TEST: false,
};


export const loadCustomers = createAsyncThunk(
    'customers/load',
    async () => {
        return await fetchCustomers();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCustomersLoading(state);
        }
    }
)

export const toggleShow01TEST = createAction<boolean|undefined>('customers/show01TEST');


export const selectCustomerList = (state: RootState) => state.customers.list;
export const selectCustomersLoading = (state: RootState) => state.customers.loading;
export const selectCustomersLoaded = (state: RootState) => state.customers.loaded;
export const selectShow01TEST = (state:RootState) => state.customers.showO1TEST;

export const selectFilteredCustomerList = createSelector(
    [selectCustomerList, selectShow01TEST],
    (list, show01TEST) => {
        return [...list]
            .filter(customer => show01TEST || customerKey(customer) !== '01-TEST')
    }
)

const customersReducer = createReducer(defaultState, builder => {
    builder
        .addCase(loadCustomers.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadCustomers.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload.sort(customerSorter);
            state.loaded = false;
        })
        .addCase(loadCustomers.rejected, (state) => {
            state.loading = false;
        })
        .addCase(toggleShow01TEST, (state, action) => {
            state.showO1TEST = action.payload ?? !state.showO1TEST;
        })
})

export default customersReducer;
