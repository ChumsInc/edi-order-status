import * as React from "react";
import {Customer, OrderFilter} from '../ducks/orders/types';
import {RootState} from '../ducks'
import {useDispatch, useSelector} from 'react-redux';
import {onChangeFilter, fetchOrdersAction} from "../ducks/orders/actions";
import CustomerFilterSelect from "./CustomerFilter";

const EDIOrdersFilter:React.FC = () => {
    const dispatch = useDispatch();

    const onChangeCustomerFilter = ({ARDivisionNo = '', CustomerNo = ''}:Customer) => dispatch(onChangeFilter({ARDivisionNo, CustomerNo}));
    const onReload = () => dispatch(fetchOrdersAction());

    return (
        <div className="row g-3">
            <div className="col-auto">
                <CustomerFilterSelect onChange={onChangeCustomerFilter}/>
            </div>
            <div className="col-auto">
                <button type="button" onClick={onReload} className="btn btn-sm btn-primary">Reload</button>
            </div>
        </div>
    )
}

export default EDIOrdersFilter;
