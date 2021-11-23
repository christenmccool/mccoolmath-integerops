import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Problem from './Problem';
import ProblemPage from './ProblemPage';

import Menu from './Menu'

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Menu />
            </Route>
            <Route exact path="/integerop">
                <ProblemPage op="mix" />
            </Route>
            <Route exact path="/integerop/add">
                <ProblemPage op="add" />
            </Route>
            <Route exact path="/integerop/sub">
                <ProblemPage op="sub" />
            </Route>
            <Route exact path="/integerop/mult">
                <ProblemPage op="mult" />
            </Route>
            <Route exact path="/integerop/div">
                <ProblemPage op="div" />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}

export default Routes;


