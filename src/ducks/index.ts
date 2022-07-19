import {combineReducers} from 'redux';

import {alertsReducer, pageSetsReducer} from 'chums-connected-components';

import ordersReducer from './orders';
import {default as customersReducer} from './customers';
import filtersReducer from './filters';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    orders: ordersReducer,
    pageSets: pageSetsReducer,
    customers: customersReducer,
    filters: filtersReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
