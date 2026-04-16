import {createAsyncThunk, createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {EDICustomer} from "chums-types";
import {customerKey} from "@/ducks/orders/utils.ts";
import {dismissAlert} from "@chumsinc/alert-list";
import {customerSorter} from "@/ducks/customers/utils.ts";
import {fetchCustomers} from "@/ducks/customers/api.ts";
import type {RootState} from "@/app/configureStore.ts";

const adapter = createEntityAdapter<EDICustomer, string>({
    selectId: (arg) => customerKey(arg),
    sortComparer: (a, b) => customerKey(a).toUpperCase().localeCompare(customerKey(b).toUpperCase()),
})

const selectors = adapter.getSelectors();

interface CustomersState {
    status: 'idle'|'loading'|'rejected';
    currentCustomer: string|null;
    showTestCustomer: boolean;
    showMAPADOCOnly: boolean;
}

const extraState = ():CustomersState => {
    const params = new URLSearchParams(window.location.search);
    return {
        status: 'idle',
        currentCustomer: params.get('customer') ?? null,
        showTestCustomer: false,
        showMAPADOCOnly: params.get('mapadoc') === 'on',
    }
}

const customerSlice = createSlice({
    name: 'customers',
    initialState: adapter.getInitialState(extraState()),
    reducers: {
        setCurrentCustomer: (state, action:PayloadAction<string|null>) => {
            state.currentCustomer = action.payload;
        },
        toggleShowTestCustomer: (state, action:PayloadAction<boolean>) => {
            state.showTestCustomer = action.payload;
        },
        toggleShowMAPADOCOnly: (state, action:PayloadAction<boolean>) => {
            state.showMAPADOCOnly = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context === loadCustomers.typePrefix) {
                    state.status = 'idle';
                }
            })
            .addAsyncThunk(loadCustomers, {
                pending: (state) => {
                    state.status = 'loading'
                },
                fulfilled: (state, action) => {
                    adapter.setAll(state, action.payload)
                    state.status = 'idle'
                },
                rejected: (state) => {
                    state.status = 'rejected'
                }
            })
    },
    selectors: {
        selectCustomerList: (state) => selectors.selectAll(state),
        selectCurrentCustomer: (state) => state.currentCustomer,
        selectCustomersStatus: (state) => state.status,
        selectShowTestCustomer: (state) => state.showTestCustomer,
        selectShowMAPADOCOnly: (state) => state.showMAPADOCOnly,
    }
})

export default customerSlice;
export const {setCurrentCustomer, toggleShowTestCustomer, toggleShowMAPADOCOnly} = customerSlice.actions
export const {selectShowTestCustomer, selectCustomersStatus, selectCustomerList, selectShowMAPADOCOnly, selectCurrentCustomer} = customerSlice.selectors

export const selectFilteredCustomerList = createSelector(
    [selectCustomerList, selectShowTestCustomer, selectShowMAPADOCOnly],
    (list, showTestCustomer, showMAPADOCOnly) => {
        return list
            .filter(customer => showTestCustomer || customerKey(customer) !== '01-TEST')
            .filter(customer => !showMAPADOCOnly || customer.isMAPADOC)
            .sort(customerSorter);
    }
)

export const loadCustomers = createAsyncThunk(
    'customers/load',
    async () => {
        return await fetchCustomers();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCustomersStatus(state) === 'idle';
        }
    }
)

