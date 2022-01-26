import React, {FormEvent} from "react";
import {fetchCustomers} from '../customers';
import {useDispatch, useSelector} from 'react-redux';
import {fetchOrdersAction} from "./actions";
import CustomerFilterSelect from "../customers/CustomerFilter";
import OrderStatusLegend from "./OrderStatusLegend";
import OrderDateFilterSelect from "../filters/OrderDateFilterSelect";
import ShipDateFilterSelect from "../filters/ShipDateFilterSelect";
import MAPADOCCheckBox from "../filters/MAPADOCCheckBox";
import CompletedCheckBox from "../filters/CompletedCheckBox";
import {selectShowCompletedFilter} from "../filters";

const EDIOrdersFilter: React.FC = () => {
    const dispatch = useDispatch();
    const showCompleted = useSelector(selectShowCompletedFilter);

    const onReload = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(fetchOrdersAction());
        dispatch(fetchCustomers());
    }

    return (
        <form className="row g-3 mb-3 align-items-end justify-content-between" onSubmit={onReload}>
            <div className="col-auto row align-items-end">
                <div className="col-auto">
                    <MAPADOCCheckBox/>
                </div>
                <div className="col-auto">
                    <label className="form-label">Customer</label>
                    <CustomerFilterSelect required={showCompleted}/>
                </div>
                <div className="col-auto">
                    <OrderDateFilterSelect/>
                </div>
                <div className="col-auto">
                    <ShipDateFilterSelect/>
                </div>
                <CompletedCheckBox/>
                <div className="col-auto">
                    <button type="submit" className="btn btn-sm btn-primary">Reload</button>
                </div>
            </div>
            <div className="col-auto">
                <label className="form-label">Legend</label>
                <OrderStatusLegend/>
            </div>
        </form>
    )
}

export default EDIOrdersFilter;
