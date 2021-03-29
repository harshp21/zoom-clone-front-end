import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import ActivateAccount from '../activate-account/ActivateAccount'
import ForgotPassword from '../forgot-password/ForgotPassword'
import Header from '../header/header'
import Home from '../home/Home'
import Join from '../join/Join'
import Login from '../login/Login'
import RetrievePassword from '../retrieve-password/RetrievePassword'
import SignUp from '../SignUp/SignUp'

function HeaderRoutes() {
    return (
        <>
            <Header />
            <Switch>
                <Route path="/sign-in" component={Login} />
                <Route path="/sign-up" component={SignUp} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/retrieve-password" component={RetrievePassword} />
                <Route path="/activate-account/:activationCode" component={ActivateAccount} />
                <Route path="/home" component={Home} />
                <Route path="/join" component={Join} />
                <Route exact path="/" component={Home} />
                <Route path='*'>
                    <Redirect to="/404" />
                </Route>
            </Switch>
        </>
    )
}

export default HeaderRoutes
