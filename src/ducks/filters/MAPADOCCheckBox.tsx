import React, {ChangeEvent, useEffect, useId} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectMapadocFilter, setCustomer, toggleFilterMapadoc} from "./index";
import {useSearchParams} from "react-router-dom";
import {customerFromKey} from "../orders/utils";
import {loadCustomers} from "../customers";
import FormCheck from "react-bootstrap/FormCheck";


const MAPADOCCheckBox = () => {
    const dispatch = useDispatch();
    const checked = useSelector(selectMapadocFilter);
    const id = useId();
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);

    useEffect(() => {
        if (searchParams.get('mapadoc')) {
            dispatch(toggleFilterMapadoc(true));
        }
    }, []);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleFilterMapadoc(ev.target.checked));
        const params = new URLSearchParams(window.location.search);
        if (ev.target.checked) {
            params.set('mapadoc', 'on');
        } else {
            params.delete('mapadoc');
        }
        setSearchParams(params);
    }

    return (
        <FormCheck type="checkbox" id={id} checked={checked} onChange={changeHandler} label="MAPADOC" />
    )
}

export default MAPADOCCheckBox;
