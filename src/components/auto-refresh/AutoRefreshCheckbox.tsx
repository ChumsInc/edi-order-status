import {type ChangeEvent, useId} from "react";
import {useAppSelector} from "@/app/configureStore.ts";
import Stack from "react-bootstrap/Stack";
import FormCheck from "react-bootstrap/FormCheck";
import {selectOrdersStatus} from "@/ducks/orders/ordersSlice.ts";
import {useEdiOrdersForm} from "@/hooks/edi-orders-form/useEdiOrdersForm.ts";

const AutoRefreshCheckbox = () => {
    const status = useAppSelector(selectOrdersStatus);
    const {autoRefresh, setAutoRefresh, updated} = useEdiOrdersForm();
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setAutoRefresh(ev.target.checked);
    }

    return (
        <Stack direction="horizontal" gap={3} className="align-items-baseline">
            <FormCheck id={id} label="Auto Refresh" onChange={changeHandler} checked={autoRefresh}/>
            {status !== 'loading' && (<span className="text-secondary">Updated: {updated}</span>)}
            {status === 'loading' && (<span className="text-info">Loading...</span>)}
        </Stack>
    )
}
export default AutoRefreshCheckbox;
