import React, { useState } from 'react';
import {Router, Route, Switch, Redirect} from 'react-router-dom';
import history from './history';
import Landing from './landing';
import Admin from './admin';
import Manager from './Manager/manager';
import './App.scss'

const App = (props) => {
    const [optionAuth, setOptionAuth] = useState('Гость')
    return (
      <>
        <Router history={history}>
            <Switch>
                <Route path="/" 
                exact
                render={ (props) => <Landing {...props} setOptionAuth={setOptionAuth} /> }
                />
                {optionAuth === 'Admin' ? <Route path="/admin" component={Admin}/> : null}
                {optionAuth === 'Manager' ? <Route path="/manager" component={Manager}/> : null}
                <Redirect to="/"/>
            </Switch>
        </Router>
      </>
    );
};

export default App;
