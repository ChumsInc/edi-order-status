import * as React from "react";
import {Customer, fetchCustomers} from '../ducks/customers';
import {RootState} from '../ducks'
import {useDispatch, useSelector} from 'react-redux';
import {onChangeFilter, fetchOrdersAction} from "../ducks/orders/actions";
import CustomerFilterSelect from "./CustomerFilter";
import {FormEvent} from "react";
import OrderStatusButton from "./OrderStatusButton";

const EDIOrdersFilter:React.FC = () => {
    const dispatch = useDispatch();
    const {showCompleted, minDate, maxDate} = useSelector((state:RootState) => state.orders.filter);

    const onChangeCustomerFilter = ({ARDivisionNo = '', CustomerNo = ''}:Customer) => dispatch(onChangeFilter({ARDivisionNo, CustomerNo}));
    const onToggleCompleted = () => dispatch(onChangeFilter({showCompleted: !showCompleted}));
    const onChangeMinDate = (ev:React.ChangeEvent) => dispatch(onChangeFilter({minDate: (ev.target as HTMLInputElement).value}))
    const onChangeMaxDate = (ev:React.ChangeEvent) => dispatch(onChangeFilter({maxDate: (ev.target as HTMLInputElement).value}))
    const onReload = (ev:FormEvent) => {
        ev.preventDefault();
        dispatch(fetchOrdersAction());
        dispatch(fetchCustomers());
    }

    return (
        <form className="row g-3 mb-3" onSubmit={onReload}>
            <div className="col-auto">
                <CustomerFilterSelect onChange={onChangeCustomerFilter} required={showCompleted}/>
            </div>
            <div className="col-auto">
                <div className="form-check form-check-inline">
                    <input type="checkbox" className="form-check-input" checked={showCompleted} onChange={onToggleCompleted}/>
                    <label className="form-check-label" onClick={onToggleCompleted}>Load Completed Orders</label>
                </div>
            </div>
            {showCompleted && (
                <>
                    <div className="col-auto">
                        <label className="form-label">From</label>
                    </div>
                    <div className="col-auto">
                        <input type="date" value={minDate} onChange={onChangeMinDate} required  className="form-control form-control-sm" />
                    </div>
                    <div className="col-auto">
                        <label className="form-label">To</label>
                    </div>
                    <div className="col-auto">
                        <input type="date" value={maxDate} onChange={onChangeMaxDate} required  className="form-control form-control-sm" />
                    </div>
                </>
            )}
            <div className="col-auto">
                <button type="submit" className="btn btn-sm btn-primary">Reload</button>
            </div>
            <div className="col-auto">
                <label>Legend</label>
            </div>
            <div className="col-auto">
                <div className="status-button-select--legend">
                    <button type="button" className="btn btn-light me-1">No Status</button>
                    <button type="button" className="btn btn-info me-1">In Process</button>
                    <button type="button" className="btn btn-success me-1">Done</button>
                    <button type="button" className="btn btn-warning me-1">Waiting</button>
                    <button type="button" className="btn btn-danger me-1">On Hold</button>
                </div>
            </div>
        </form>
    )
}

export default EDIOrdersFilter;
