import React, {useEffect} from 'react';
import EDIOrdersList from "../ducks/orders/EDIOrdersList";
import "./App.css";
import {fetchCustomers} from "../ducks/customers";
import {AlertList} from "chums-connected-components";
import {useAppDispatch} from "./hooks";
import {Route, Routes} from "react-router-dom";

function App() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchCustomers());
    })
    return (
        <div>
            <AlertList/>
            <Routes>
                <Route path="/" element={<EDIOrdersList/>}/>
            </Routes>
        </div>
    );
}

export default App;
