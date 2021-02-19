import {combineReducers} from 'redux';

import alertsReducer from './alerts';
import ordersReducer from './orders';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    orders: ordersReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
