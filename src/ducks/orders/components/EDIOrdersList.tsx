import {useSelector} from "react-redux";
import EDIOrderTable from "./EDIOrderTable.tsx";
import {selectFilteredOrdersList, selectOrdersStatus} from "../ordersSlice.ts";
import {ErrorBoundary} from 'react-error-boundary';
import ErrorBoundaryFallbackAlert from "../../alerts/ErrorBoundaryFallbackAlert.tsx";
import Alert from "react-bootstrap/Alert";
import {useEDIOrders} from "@/hooks/edi-orders/useEDIOrders.ts";

const EDIOrdersList = () => {
    const orders = useSelector(selectFilteredOrdersList);
    const loading = useSelector(selectOrdersStatus);
    const {page, rowsPerPage} = useEDIOrders();

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert} fallback={undefined}>
            <EDIOrderTable rows={orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}/>
            {loading === 'idle' && !orders.length && (
                <Alert color="warning">There are no open orders for this customer.</Alert>
            )}
        </ErrorBoundary>
    )
}

export default EDIOrdersList
