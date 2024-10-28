import React, {ChangeEvent, useEffect, useId, useRef, useState} from "react";
import {loadOrders} from "./actions";
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectOrdersLoading} from "./selectors";
import dayjs from "dayjs";
import Stack from "react-bootstrap/Stack";
import FormCheck from "react-bootstrap/FormCheck";

const REFRESH_TIMER_MS = 10 * 60 * 1000;

const AutoRefreshCheckbox = () => {
    const dispatch = useAppDispatch();
    const timer = useRef<number>(0);
    const loading = useSelector(selectOrdersLoading);
    const [checked, setChecked] = useState(false);
    const [updated, setUpdated] = useState<number|null>(null)
    const id = useId();

    useEffect(() => {
        if (loading === 'idle') {
            setUpdated(new Date().valueOf());
        }
    }, [loading]);

    useEffect(() => {
        if (checked && loading === 'idle') {
            timer.current = window.setInterval(() => {
                dispatch(loadOrders())
            }, REFRESH_TIMER_MS)
        }
        return () => {
            window.clearInterval(timer.current);
        }
    }, [checked, loading]);

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        setChecked(ev.target.checked);
    }

    return (
        <Stack direction="horizontal" gap={1}>
            {loading === 'idle' && !!updated && <span className="me-3 text-muted">Updated: {dayjs(updated).format('HH:mm:ss')}</span>}
            <FormCheck id={id} label="Auto Refresh" onChange={changeHandler} checked={checked} />
        </Stack>
    )
}
export default AutoRefreshCheckbox;
