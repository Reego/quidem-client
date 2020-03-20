import React from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import Quidem from './quidem/index';
import Create from './create/index';
import Home from './home/index';

const App = () => (
    <Router>
        <Switch>
            <Route path='/quidem'>
                <Quidem/>
            </Route>
            <Route path='/create'>
                <Create/>
            </Route>
            <Route>
                <Home/>
            </Route>
        </Switch>
    </Router>
);

export default App;
