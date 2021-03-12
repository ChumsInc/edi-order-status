import {combineReducers} from 'redux';

import alertsReducer from './alerts';
import ordersReducer from './orders';
import pageReducer from './page';
import customersReducer from './customers';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    orders: ordersReducer,
    page: pageReducer,
    customers: customersReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
