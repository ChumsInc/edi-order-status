import React, {ChangeEvent, useId} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectMapadocFilter, toggleFilterMapadoc} from "./index";
import {useSearchParams} from "react-router-dom";


const MAPADOCCheckBox: React.FC = () => {
    const dispatch = useDispatch();
    const checked = useSelector(selectMapadocFilter);
    const id = useId();
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);

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
        <div className="form-check">
            <label className="form-check-label" htmlFor={id}>MAPADOC</label>
            <input type="checkbox" className="form-check-input" id={id}
                   checked={checked} onChange={changeHandler}/>
        </div>
    )
}

export default MAPADOCCheckBox;
