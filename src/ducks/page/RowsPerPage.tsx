import React, {ChangeEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from '../index';
import {setRowsPerPage} from "./index";


const RowsPerPage:React.FC = () => {
    const {rowsPerPage} = useSelector((state:RootState) => state.page);
    const dispatch = useDispatch();
    const onChange = (ev:ChangeEvent) => {
        dispatch(setRowsPerPage(Number((ev.target as HTMLSelectElement).value)));
    }

    return (
        <>
            <label>Show</label>
            <select className="form-select form-select-sm" value={rowsPerPage} onChange={onChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
            </select>
        </>
    )
};

export default RowsPerPage;
