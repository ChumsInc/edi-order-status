import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../index";
import {toggleAutoRefreshAction} from "./actions";

const AutoRefreshCheckbox: React.FC = () => {
    const {autoRefresh} = useSelector((state: RootState) => state.orders);
    const dispatch = useDispatch();
    return (
        <div className="form-check">
            <label className="form-check-label" htmlFor="edi-order-status--auto-refresh">Auto Refresh</label>
            <input type="checkbox" className="form-check-input" checked={autoRefresh}
                   id="edi-order-status--auto-refresh"
                   onChange={() => dispatch(toggleAutoRefreshAction())}/>
        </div>
    )
}
export default AutoRefreshCheckbox;
