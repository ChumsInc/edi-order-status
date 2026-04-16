import {loadCustomers} from '../../customers/customersSlice.ts';
import {useSelector} from 'react-redux';
import CustomerFilterSelect from "../../customers/components/CustomerFilter.tsx";
import OrderStatusLegend from "./OrderStatusLegend.tsx";
import OrderDateFilterSelect from "./OrderDateFilterSelect.tsx";
import ShipDateFilterSelect from "./ShipDateFilterSelect.tsx";
import MAPADOCCheckBox from "../../customers/components/MAPADOCCheckBox.tsx";
import CompletedCheckBox from "./CompletedCheckBox.tsx";
import {useAppDispatch} from "@/app/configureStore.ts";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import {selectOrdersStatus} from "@/ducks/orders/ordersSlice.ts";
import {useEdiOrdersForm} from "@/hooks/edi-orders-form/useEdiOrdersForm.ts";

const EDIOrdersFilter = () => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectOrdersStatus);
    const {formRef, completed, loadOrders} = useEdiOrdersForm();

    const onReload = () => {
        loadOrders();
        dispatch(loadCustomers());
    }

    return (
        <Row as={Form} className="g-3 mb-3 align-items-end justify-content-between" action={onReload} ref={formRef}>
            <Col xs="auto">
                <MAPADOCCheckBox/>
            </Col>
            <Col xs="auto">
                <label className="form-label">Customer</label>
                <CustomerFilterSelect required={completed}/>
            </Col>
            <CompletedCheckBox/>
            <Col xs="auto">
                <Button type="submit" size="sm" disabled={loading !== 'idle'}>
                    {loading !== 'idle' && (
                        <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true"
                                 className="me-1"/>)}
                    Reload
                </Button>
            </Col>
            <Col xs="auto">
                <OrderDateFilterSelect/>
            </Col>
            <Col xs="auto">
                <ShipDateFilterSelect/>
            </Col>
            <Col/>
            <Col xs="auto">
                <label className="form-label">Legend</label>
                <OrderStatusLegend/>
            </Col>
        </Row>
    )
}

export default EDIOrdersFilter;
