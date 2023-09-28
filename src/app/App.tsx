import React, {useEffect} from 'react';
import EDIOrdersList from "../ducks/orders/EDIOrdersList";
import "./App.css";
import {loadCustomers} from "../ducks/customers";
import {useAppDispatch} from "./configureStore";
import {Route, Routes} from "react-router-dom";
import AlertList from "../ducks/alerts/AlertList";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadCustomers());
    }, [])

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
