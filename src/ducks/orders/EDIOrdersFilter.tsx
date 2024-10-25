import React, {FormEvent} from "react";
import {loadCustomers} from '../customers';
import {useSelector} from 'react-redux';
import {loadOrders} from "./actions";
import CustomerFilterSelect from "../customers/CustomerFilter";
import OrderStatusLegend from "./OrderStatusLegend";
import OrderDateFilterSelect from "../filters/OrderDateFilterSelect";
import ShipDateFilterSelect from "../filters/ShipDateFilterSelect";
import MAPADOCCheckBox from "../filters/MAPADOCCheckBox";
import CompletedCheckBox from "../filters/CompletedCheckBox";
import {selectShowCompletedFilter} from "../filters";
import {useAppDispatch} from "../../app/configureStore";
import {selectOrdersLoading} from "./selectors";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'

const EDIOrdersFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const showCompleted = useSelector(selectShowCompletedFilter);
    const loading = useSelector(selectOrdersLoading);

    const onReload = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(loadOrders());
        dispatch(loadCustomers());
    }

    return (
        <Row as={Form} className="g-3 mb-3 align-items-end justify-content-between" onSubmit={onReload}>
            <Col xs="auto">
                <MAPADOCCheckBox/>
            </Col>
            <Col xs="auto">
                <label className="form-label">Customer</label>
                <CustomerFilterSelect required={showCompleted}/>
            </Col>
            <Col xs="auto">
                <OrderDateFilterSelect/>
            </Col>
            <Col xs="auto">
                <ShipDateFilterSelect/>
            </Col>
            <Col xs="auto">
                <CompletedCheckBox/>
            </Col>
            <Col xs="auto">
                <Button type="submit" size="sm" disabled={loading}>
                    {loading && (<Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true"
                                          className="me-1"/>)}
                    Reload
                </Button>
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
