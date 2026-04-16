import {type ChangeEvent, useEffect, useId} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "react-router";
import FormCheck from "react-bootstrap/FormCheck";
import {selectShowMAPADOCOnly, toggleShowMAPADOCOnly} from "@/ducks/customers/customersSlice.ts";


const MAPADOCCheckBox = () => {
    const dispatch = useDispatch();
    const checked = useSelector(selectShowMAPADOCOnly);
    const id = useId();
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);

    useEffect(() => {
        if (searchParams.get('mapadoc')) {
            dispatch(toggleShowMAPADOCOnly(true));
        }
    }, [searchParams, dispatch]);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShowMAPADOCOnly(ev.target.checked));
        const params = new URLSearchParams(window.location.search);
        if (ev.target.checked) {
            params.set('mapadoc', 'on');
        } else {
            params.delete('mapadoc');
        }
        setSearchParams(params);
    }

    return (
        <FormCheck type="checkbox" id={id} checked={checked} onChange={changeHandler} label="MAPADOC"/>
    )
}

export default MAPADOCCheckBox;
