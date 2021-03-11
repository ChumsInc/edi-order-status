import React, {useEffect} from 'react';
import AlertList from "./ducks/alerts/AlertList";
import EDIOrdersList from "./ducks/orders/EDIOrdersList";
import "./App.css";
import {useDispatch} from "react-redux";
import {fetchCustomers} from "./ducks/customers";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCustomers());
    })
    return (
        <div>
            <AlertList/>
            <EDIOrdersList />
        </div>
    );
}

export default App;
