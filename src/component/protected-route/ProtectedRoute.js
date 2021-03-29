import React, { useEffect, useContext, useState } from 'react'
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../../context/user/user-context';

const ProtectedRoute = ({ component: Component, ...rest }) => {

    const userContext = useContext(UserContext);
    const [renderRoutes, setRenderRoutes] = useState(false);
    useEffect(() => {
        userContext.isUserLoggedIn().then(res => {
            setRenderRoutes(true);
        }).catch(err => setRenderRoutes(true));

    }, [])
    return (
        <>
            {renderRoutes && <Route {...rest} render={

                (props) => {
                    if (userContext.userState.isLoggedIn) {
                        return <Component {...props} />
                    } else {
                        return <Redirect to={{
                            pathname: "/sign-in",
                            state: { next: props.location.pathname }
                        }} />
                    }
                }
            } />}

        </>
    )
}

export default ProtectedRoute
