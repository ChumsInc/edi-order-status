import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {alertsSlice} from '@chumsinc/alert-list'
import customersSlice from "@/ducks/customers/customersSlice.ts";
import ordersSlice from "@/ducks/orders/ordersSlice.ts";

const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    [customersSlice.reducerPath]: customersSlice.reducer,
    [ordersSlice.reducerPath]: ordersSlice.reducer,
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

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
