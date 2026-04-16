import Col from "react-bootstrap/esm/Col";
import AutoRefreshCheckbox from "@/components/auto-refresh/AutoRefreshCheckbox.tsx";
import Show01TEST from "@/ducks/customers/components/Show01TESTToggle.tsx";
import {TablePagination} from "@chumsinc/sortable-tables";
import Row from "react-bootstrap/esm/Row";
import {useEDIOrders} from "@/hooks/edi-orders/useEDIOrders.ts";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "@/ducks/alerts/ErrorBoundaryFallbackAlert.tsx";

export default function EDIOrdersPagination() {
    const {page, setPage, rowsPerPage, setRowsPerPage, count} = useEDIOrders();
    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <Row className="g-3 align-items-baseline">
                <Col xs="auto">
                    <AutoRefreshCheckbox/>
                </Col>
                <Col xs="auto">
                    <Show01TEST/>
                </Col>
                <Col/>
                <Col xs="auto">
                    <TablePagination size="sm" showFirst showLast
                                     page={page} onChangePage={setPage} rowsPerPage={rowsPerPage}
                                     rowsPerPageProps={{onChange: setRowsPerPage}}
                                     count={count}/>
                </Col>
            </Row>
        </ErrorBoundary>
    )
}
