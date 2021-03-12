import * as React from "react";
import {FormEvent} from "react";
import {Customer, fetchCustomers} from '../customers';
import {RootState} from '../index'
import {useDispatch, useSelector} from 'react-redux';
import {fetchOrdersAction, onChangeFilter} from "./actions";
import CustomerFilterSelect from "../customers/CustomerFilter";
import OrderStatusLegend from "./OrderStatusLegend";
import OrderDateFilterSelect from "./OrderDateFilterSelect";
import ShipDateFilterSelect from "./ShipDateFilterSelect";

const EDIOrdersFilter: React.FC = () => {
    const dispatch = useDispatch();
    const {
        showCompleted,
        minDate,
        maxDate,
        OrderDate,
        ShipExpireDate,
        mapadoc
    } = useSelector((state: RootState) => state.orders.filter);

    const onChangeCustomerFilter = ({
                                        ARDivisionNo = '',
                                        CustomerNo = ''
                                    }: Customer) => dispatch(onChangeFilter({ARDivisionNo, CustomerNo}));
    const onChangeOrderDateFilter = (OrderDate: string) => dispatch(onChangeFilter({OrderDate}));
    const onChangeShipDateFilter = (ShipExpireDate: string) => dispatch(onChangeFilter({ShipExpireDate}));
    const onToggleCompleted = () => dispatch(onChangeFilter({showCompleted: !showCompleted}));
    const onChangeMinDate = (ev: React.ChangeEvent) => dispatch(onChangeFilter({minDate: (ev.target as HTMLInputElement).value}))
    const onChangeMaxDate = (ev: React.ChangeEvent) => dispatch(onChangeFilter({maxDate: (ev.target as HTMLInputElement).value}))
    const onReload = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(fetchOrdersAction());
        dispatch(fetchCustomers());
    }

    return (
        <form className="row g-3 mb-3 align-items-end justify-content-between" onSubmit={onReload}>
            <div className="col-auto row align-items-end">
                <div className="col-auto">
                    <div className="form-check">
                        <label className="form-check-label" htmlFor="edi-order-status--mapadoc">MAPADOC</label>
                        <input type="checkbox" className="form-check-input" id="edi-order-status--mapadoc"
                               checked={mapadoc || false} onChange={() => dispatch(onChangeFilter({mapadoc: !mapadoc}))} />
                    </div>
                </div>
                <div className="col-auto">
                    <label className="form-label">Customer</label>
                    <CustomerFilterSelect onChange={onChangeCustomerFilter} required={showCompleted}/>
                </div>
                <div className="col-auto">
                    <OrderDateFilterSelect onChange={onChangeOrderDateFilter} value={OrderDate || ''}/>
                </div>
                <div className="col-auto">
                    <ShipDateFilterSelect onChange={onChangeShipDateFilter} value={ShipExpireDate || ''}/>
                </div>
                <div className="col-auto">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={showCompleted}
                               onChange={onToggleCompleted}/>
                        <label className="form-check-label" onClick={onToggleCompleted}>Load Completed Orders</label>
                    </div>
                </div>
                {showCompleted && (
                    <>
                        <div className="col-auto">
                            <label className="form-label">From</label>
                            <input type="date" value={minDate} onChange={onChangeMinDate} required
                                   className="form-control form-control-sm"/>
                        </div>
                        <div className="col-auto">
                            <label className="form-label">To</label>
                            <input type="date" value={maxDate} onChange={onChangeMaxDate} required
                                   className="form-control form-control-sm"/>
                        </div>
                    </>
                )}
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
