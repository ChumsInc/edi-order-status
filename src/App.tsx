import React from 'react';
import {useDispatch} from 'react-redux';
import {addAlertAction} from "./ducks/alerts";
import AlertList from "./ducks/alerts/AlertList";
import reportWebVitals from "./reportWebVitals";
import EDIOrdersList from "./ducks/orders/EDIOrdersList";

function App() {
  const dispatch = useDispatch();
  return (
    <div>
      <AlertList />
      <EDIOrdersList />
    </div>
  );
}

export default App;
