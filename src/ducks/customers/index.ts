import {RootState} from "../../app/configureStore";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchCustomers} from "./api";
import {customerSorter} from "./utils";


export interface Customer {
    ARDivisionNo: string,
    CustomerNo: string,
    CustomerName: string,
    isMAPADOC: boolean,
}

export interface CustomerState {
    list: Customer[],
    loading: boolean,
    loaded: boolean;
}

const defaultState: CustomerState = {
    list: [],
    loading: false,
    loaded: false,
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


export const selectCustomerList = (state: RootState) => state.customers.list;
export const selectCustomersLoading = (state: RootState) => state.customers.loading;
export const selectCustomersLoaded = (state: RootState) => state.customers.loaded;

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
})

export default customersReducer;
