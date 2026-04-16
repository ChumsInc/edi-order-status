import {type ChangeEvent, useId} from 'react';
import FormCheck from "react-bootstrap/FormCheck";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {selectShowTestCustomer, toggleShowTestCustomer} from "@/ducks/customers/customersSlice.ts";

export default function Show01TEST() {
    const dispatch = useAppDispatch();
    const show = useAppSelector(selectShowTestCustomer);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShowTestCustomer(ev.target.checked))
    }

    return (
        <FormCheck type="checkbox" checked={show} id={id} label="Show Chums Test Account" onChange={changeHandler}/>
    )
}
