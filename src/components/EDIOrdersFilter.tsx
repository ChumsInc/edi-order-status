import * as React from "react";
import {Customer} from '../ducks/customers';
import {RootState} from '../ducks'
import {useDispatch, useSelector} from 'react-redux';
import {onChangeFilter, fetchOrdersAction} from "../ducks/orders/actions";
import CustomerFilterSelect from "./CustomerFilter";
import {FormEvent} from "react";

const EDIOrdersFilter:React.FC = () => {
    const dispatch = useDispatch();
    const {showCompleted, minDate, maxDate, CustomerPONo} = useSelector((state:RootState) => state.orders.filter);

    const onChangeCustomerFilter = ({ARDivisionNo = '', CustomerNo = ''}:Customer) => dispatch(onChangeFilter({ARDivisionNo, CustomerNo}));
    const onToggleCompleted = () => dispatch(onChangeFilter({showCompleted: !showCompleted}));
    const onChangeMinDate = (ev:React.ChangeEvent) => dispatch(onChangeFilter({minDate: (ev.target as HTMLInputElement).value}))
    const onChangeMaxDate = (ev:React.ChangeEvent) => dispatch(onChangeFilter({maxDate: (ev.target as HTMLInputElement).value}))
    const onReload = (ev:FormEvent) => {
        ev.preventDefault();
        dispatch(fetchOrdersAction());
    }

    return (
        <form className="row g-3" onSubmit={onReload}>
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
        </form>
    )
}

export default EDIOrdersFilter;
