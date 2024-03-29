import React, {ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectShipDates} from "../orders/selectors";
import {selectShipDateFilter, selectShowCompletedFilter, setShipDate} from "./index";

const ShipDateFilterSelect: React.FC = () => {
    const dispatch = useDispatch();
    const shipDates = useSelector(selectShipDates);
    const value = useSelector(selectShipDateFilter);
    const showCompleted = useSelector(selectShowCompletedFilter);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setShipDate(ev.target.value));
    }

    return (
        <div>
            <label className="form-label">Ship Date</label>
            <select className="form-select form-select-sm" onChange={changeHandler} value={value}>
                <option value="">All</option>
                <option value="" disabled/>
                {showCompleted && (<option value="closed">Closed Orders</option>)}
                {shipDates.map(date => (
                    <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>))}
            </select>
        </div>
    )
}

export default ShipDateFilterSelect;
