import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from 'redux';
import {alertsReducer, pageSetsReducer} from "chums-connected-components";
import ordersReducer from "../ducks/orders";
import {default as customersReducer} from '../ducks/customers';
import filtersReducer from "../ducks/filters";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    orders: ordersReducer,
    pageSets: pageSetsReducer,
    customers: customersReducer,
    filters: filtersReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error']
        }
    })
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;
