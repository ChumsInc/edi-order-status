import React from 'react';
import AlertList from "./ducks/alerts/AlertList";
import EDIOrdersList from "./components/EDIOrdersList";
import "./App.css";

function App() {
    return (
        <div>
            <AlertList/>
            <EDIOrdersList/>
        </div>
    );
}

export default App;
