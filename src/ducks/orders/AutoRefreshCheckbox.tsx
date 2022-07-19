import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../index";
import {toggleAutoRefreshAction} from "./actions";
import {useAppDispatch} from "../../app/hooks";

const AutoRefreshCheckbox: React.FC = () => {
    const dispatch = useAppDispatch();
    const {autoRefresh} = useSelector((state: RootState) => state.orders);
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
