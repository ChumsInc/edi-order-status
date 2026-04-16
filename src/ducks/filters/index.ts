import type {RootState} from "../../app/configureStore";
import {createAction, createReducer} from "@reduxjs/toolkit";

export interface FilterCustomer {
    Company?: string,
    ARDivisionNo: string,
    CustomerNo: string,
}

interface FiltersState {
    orderDate: string,
    shipDate: string,
    showCompleted: boolean,
    minDate: string,
    maxDate: string,
}


const defaultState = (): FiltersState => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
        orderDate: searchParams.get('orderDate') || '',
        shipDate: searchParams.get('shipDate') || '',
        showCompleted: searchParams.get('showCompleted') === 'on',
        minDate: searchParams.get('minDate') || '',
        maxDate: searchParams.get('maxDate') || '',
    }
}


export const toggleShowCompleted = createAction<boolean | undefined>('filters/toggleShowCompleted');
export const setMinDate = createAction<string>('filters/setMinDate');
export const setMaxDate = createAction<string>('filters/setMaxDate');
export const setOrderDate = createAction<string>('filters/setOrderDate');
export const setShipDate = createAction<string>('filters/setShipDate');

export const selectShowCompletedFilter = (state: RootState) => state.filters.showCompleted;
export const selectMinDateFilter = (state: RootState) => state.filters.minDate;
export const selectMaxDateFilter = (state: RootState) => state.filters.maxDate;
export const selectOrderDateFilter = (state: RootState) => state.filters.orderDate;
export const selectShipDateFilter = (state: RootState) => state.filters.shipDate;

const filtersReducer = createReducer(defaultState, builder => {
    builder
        .addCase(toggleShowCompleted, (state, action) => {
            state.showCompleted = action.payload ?? !state.showCompleted;
        })
        .addCase(setMinDate, (state, action) => {
            state.minDate = action.payload;
        })
        .addCase(setMaxDate, (state, action) => {
            state.maxDate = action.payload;
        })
        .addCase(setOrderDate, (state, action) => {
            state.orderDate = action.payload;
        })
        .addCase(setShipDate, (state, action) => {
            state.shipDate = action.payload;
        })

});

export default filtersReducer;
