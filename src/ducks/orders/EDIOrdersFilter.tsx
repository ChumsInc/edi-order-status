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
import {SpinnerButton} from "chums-components";
import {selectOrdersLoading} from "./selectors";

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
                    <SpinnerButton type="submit" size="sm" spinning={loading}>Reload</SpinnerButton>
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
