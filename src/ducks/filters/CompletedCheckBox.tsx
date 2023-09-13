import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    setMaxDate,
    setMinDate,
    selectMaxDateFilter,
    selectMinDateFilter,
    selectShowCompletedFilter,
    toggleShowCompleted
} from "./index";

const CompletedCheckBox: React.FC = () => {
    const dispatch = useDispatch();
    const showCompleted = useSelector(selectShowCompletedFilter);
    const minDate = useSelector(selectMinDateFilter);
    const maxDate = useSelector(selectMaxDateFilter);

    const onToggleCompleted = () => dispatch(toggleShowCompleted(!showCompleted));
    const onChangeMinDate = (ev: React.ChangeEvent<HTMLInputElement>) => dispatch(setMinDate(ev.target.value))
    const onChangeMaxDate = (ev: React.ChangeEvent<HTMLInputElement>) => dispatch(setMaxDate(ev.target.value));

    return (
        <>
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
        </>
    )
}

export default CompletedCheckBox;
