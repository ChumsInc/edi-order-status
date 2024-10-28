import React, {ChangeEvent, useId} from 'react';
import FormCheck from "react-bootstrap/FormCheck";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectShow01TEST, toggleShow01TEST} from "./index";

export default function Show01TEST() {
    const dispatch = useAppDispatch();
    const show = useAppSelector(selectShow01TEST);
    const id = useId();

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShow01TEST(ev.target.checked))
    }

    return (
        <FormCheck type="checkbox" checked={show} id={id} label="Show 01-TEST" onChange={changeHandler} />
    )
}
