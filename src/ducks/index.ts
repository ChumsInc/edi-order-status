import {combineReducers} from 'redux';

import {alertsReducer, pagesReducer} from 'chums-ducks';

import ordersReducer from './orders';
import customersReducer from './customers';
import filtersReducer from './filters';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    orders: ordersReducer,
    pages: pagesReducer,
    customers: customersReducer,
    filters: filtersReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
