import React from 'react';
import {Provider} from 'react-redux';
import App from './app/App';
import store from './app/configureStore'
import {createRoot} from "react-dom/client";
import {HashRouter as Router} from 'react-router-dom';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <App/>
            </Router>
        </Provider>
    </React.StrictMode>
);
