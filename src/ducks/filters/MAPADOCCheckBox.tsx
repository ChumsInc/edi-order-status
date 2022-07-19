import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {mapadocChangedAction, selectMapadocFilter} from "./index";
import {useSearchParams} from "react-router-dom";


const MAPADOCCheckBox: React.FC = () => {
    const dispatch = useDispatch();
    const mapadoc = useSelector(selectMapadocFilter);
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);

    const changeHandler = () => {
        const nextMapadoc = !mapadoc;
        dispatch(mapadocChangedAction(nextMapadoc));
        const params = new URLSearchParams(window.location.search);
        if (nextMapadoc) {
            params.set('mapadoc', 'on');
        } else {
            params.delete('mapadoc');
        }
        setSearchParams(params);
    }

    return (
        <div className="form-check">
            <label className="form-check-label" htmlFor="edi-order-status--mapadoc">MAPADOC</label>
            <input type="checkbox" className="form-check-input" id="edi-order-status--mapadoc"
                   checked={mapadoc || false} onChange={changeHandler}/>
        </div>
    )
}

export default MAPADOCCheckBox;
