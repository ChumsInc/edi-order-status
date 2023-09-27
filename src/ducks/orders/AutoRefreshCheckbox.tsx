import React, {useEffect, useRef, useState} from "react";
import {loadOrders} from "./actions";
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {selectOrdersLoading} from "./selectors";
import dayjs from "dayjs";

const REFRESH_TIMER_MS = 10 * 60 * 1000;

const AutoRefreshCheckbox: React.FC = () => {
    const dispatch = useAppDispatch();
    const timer = useRef<number>(0);
    const loading = useSelector(selectOrdersLoading);
    const [checked, setChecked] = useState(false);
    const [updated, setUpdated] = useState<number|null>(null)

    useEffect(() => {
        if (!loading) {
            setUpdated(new Date().valueOf());
        }
    }, [loading]);

    useEffect(() => {
        if (checked && !loading) {
            timer.current = window.setInterval(() => {
                dispatch(loadOrders())
            }, REFRESH_TIMER_MS)
        }
        return () => {
            window.clearInterval(timer.current);
        }
    }, [checked, loading]);

    return (
        <div className="d-flex">
            {!loading && !!updated && <span className="me-3 text-muted">Updated: {dayjs(updated).format('HH:mm:ss')}</span>}
            <div className="form-check">
                <label className="form-check-label" htmlFor="edi-order-status--auto-refresh">Auto Refresh</label>
                <input type="checkbox" className="form-check-input" checked={checked}
                       id="edi-order-status--auto-refresh"
                       onChange={(ev) => setChecked(ev.target.checked)}/>
            </div>
        </div>
    )
}
export default AutoRefreshCheckbox;
