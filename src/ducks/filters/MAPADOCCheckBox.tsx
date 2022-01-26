import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {mapadocChangedAction, selectMapadocFilter} from "./index";


const MAPADOCCheckBox: React.FC = () => {
    const dispatch = useDispatch();
    const mapadoc = useSelector(selectMapadocFilter);
    const changeHandler = () => {
        dispatch(mapadocChangedAction(!mapadoc));
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
