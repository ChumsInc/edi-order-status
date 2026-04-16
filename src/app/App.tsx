import {useEffect} from 'react';
import {loadCustomers} from "../ducks/customers/customersSlice.ts";
import {useAppDispatch} from "./configureStore";
import {Route, Routes} from "react-router";
import AppAlertList from "@/ducks/alerts/AppAlertList.tsx";
import EDIOrdersFilter from "@/ducks/orders/components/EDIOrdersFilter.tsx";
import AppContainer from "@/app/AppContainer.ts";
import OrdersProvider from "@/hooks/edi-orders/OrdersProvider.tsx";
import EDIOrdersList from "@/ducks/orders/components/EDIOrdersList.tsx";
import EDIOrdersPagination from "@/ducks/orders/components/EDIOrdersPagination.tsx";
import AutoRefreshProvider from "@/components/auto-refresh/AutoRefreshProvider.tsx";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "@/ducks/alerts/ErrorBoundaryFallbackAlert.tsx";
import OrdersFormProvider from "@/hooks/edi-orders-form/OrdersFormProvider.tsx";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadCustomers());
    }, [dispatch])

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <AppContainer>
                <AppAlertList/>
                <OrdersFormProvider>
                    <OrdersProvider>
                        <AutoRefreshProvider>
                            <EDIOrdersFilter/>
                            <Routes>
                                <Route path="/" element={<EDIOrdersList/>}/>
                            </Routes>
                            <EDIOrdersPagination />
                        </AutoRefreshProvider>
                    </OrdersProvider>
                </OrdersFormProvider>
            </AppContainer>
        </ErrorBoundary>
    );
}

export default App;
