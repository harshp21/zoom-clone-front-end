import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { MeetingContext } from '../../context/meeting/meeting-context';
import { UserContext } from '../../context/user/user-context';
import zoomLogo from "../../../src/zoom-logo.png";
import './header.css';

function Header() {

    const userContext = useContext(UserContext);
    const meetingContext = useContext(MeetingContext);

    const onSignoutHandler = () => {
        userContext.logOutUser()
    }

    useEffect(() => {
        userContext.isUserLoggedIn();
    }, [])


    return (
        <div className="header">
            <div className="header__logo">
                <img className="logo" src={zoomLogo} alt="Zoom Logo" />
            </div>
            <div className="header__nav">
                <div className="header__nav_nav-items">
                    <Link to='/join'>Join a meeting</Link>
                </div>
                <div className="header__nav_nav-items" onClick={() => meetingContext.hostMeeting()}>
                    Host a meeting
                </div>
                <div className="header__nav_nav-items">
                    {!userContext.userState.isLoggedIn ?
                        <Link to="/sign-in" > Sign in </Link> :
                        <div className="Link" onClick={onSignoutHandler}>Sign out</div>
                    }

                </div>
            </div>
        </div>
    )
}

export default Header
