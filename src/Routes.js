import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Problem from './Problem';
import Menu from './Menu'

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Menu />
            </Route>
            <Route exact path="/integerop">
                <Problem />
            </Route>
            <Route exact path="/integerop/add">
                <Problem op="add" />
            </Route>
            <Route exact path="/integerop/sub">
                <Problem op="sub" />
            </Route>
            <Route exact path="/integerop/mult">
                <Problem op="mult" />
            </Route>
            <Route exact path="/integerop/div">
                <Problem op="div" />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}

export default Routes;


