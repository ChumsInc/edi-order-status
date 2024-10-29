import React, {useEffect} from 'react';
import EDIOrdersList from "../ducks/orders/EDIOrdersList";
import "./App.css";
import {loadCustomers} from "../ducks/customers";
import {useAppDispatch} from "./configureStore";
import {Route, Routes} from "react-router-dom";
import AlertList from "../ducks/alerts/AlertList";
import EDIOrdersFilter from "../ducks/orders/EDIOrdersFilter";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadCustomers());
    }, [])

    return (
        <div>
            <AlertList/>
            <EDIOrdersFilter/>
            <Routes>
                <Route path="/" element={<EDIOrdersList/>}/>
            </Routes>
        </div>
    );
}

export default App;
