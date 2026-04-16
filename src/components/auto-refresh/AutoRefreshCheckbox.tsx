import {type ChangeEvent, useId} from "react";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import Stack from "react-bootstrap/Stack";
import FormCheck from "react-bootstrap/FormCheck";
import {useAutoRefresh} from "@/components/auto-refresh/useAutoRefresh.ts";
import {selectOrdersStatus} from "@/ducks/orders/ordersSlice.ts";

const AutoRefreshCheckbox = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectOrdersStatus);
    const {checked, setChecked, updated} = useAutoRefresh();
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setChecked(ev.target.checked);
    }

    return (
        <Stack direction="horizontal" gap={3} className="align-items-baseline">
            <FormCheck id={id} label="Auto Refresh" onChange={changeHandler} checked={checked}/>
            {status !== 'loading'  && (<span className="text-secondary">Updated: {updated}</span>)}
            {status === 'loading' && (<span className="text-info">Loading...</span>)}
        </Stack>
    )
}
export default AutoRefreshCheckbox;
