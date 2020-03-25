import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

const reducer = (state={}) => {
    return state;
}

const defaultState = {
    quidem: {
        phase: 2,
        vote: [],
        settings: {},
        votes: {},
        nominations: [
            {
                nomination_id: 2,
                nomination: 'Who?',
            },
            {
                nomination_id: -1,
                nomination: 'Woot woot!',
            }
        ],
        users: {
            1: 'Bubba',
        },
    },
    user: {
        consumer_id: 0,
        nickname: null,
        votes: [],
    },
    socket: null
};

const store = createStore(reducer, defaultState);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
