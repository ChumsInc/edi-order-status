import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../index";

const shipExpireDateSelector = (state:RootState):string[] => {
    const dates:{[key:string]:string} = {};
    const {ARDivisionNo, CustomerNo} = state.orders.filter;
    state.orders.list
        .filter(order => !ARDivisionNo || !CustomerNo || (order.ARDivisionNo === ARDivisionNo && order.CustomerNo === CustomerNo))
        .forEach(order => {
            if (!!order.ShipExpireDate) {
                dates[order.ShipExpireDate] = order.ShipExpireDate
            }
        });
    return Object.values(dates).sort();
}

interface Props {
    onChange: (shipExpireDate: string) => void,
    value: string;
}

const ShipDateFilterSelect: React.FC<Props> = ({onChange, value}) => {
    const shipDates = useSelector(shipExpireDateSelector);
    if (shipDates.length === 0) {
        return null;
    }
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        onChange(ev.target.value);
    }

    return (
        <div>
            <label className="form-label">Ship Date</label>
            <select className="form-select form-select-sm" onChange={changeHandler} value={value || ''}>
                <option value="">All</option>
                {shipDates.map(date => (
                    <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>))}
            </select>
        </div>
    )
}

export default ShipDateFilterSelect;
