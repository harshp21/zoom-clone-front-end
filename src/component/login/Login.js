import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/user/user-context';
import './login.css';

function Login(props) {

    const [userCredentails, setUserCredentials] = useState({ emailId: '', password: '' });
    const userContext = useContext(UserContext);

    const onSubmitHandler = () => {
        const { location: { state } } = props;
        if (state && state.next) {
            userContext.logInUser(userCredentails, state.next);
        } else {
            userContext.logInUser(userCredentails);
        }
    }
    return (
        <div className="form">
            <div className="form__title">
                Sign In
            </div>
            <div className="form__content">
                <div className="form__content_label">Email Address</div>
                <div className="form__content_input">
                    <input type="email" placeholder="Email Address" value={userCredentails.emailId} onChange={(e) => setUserCredentials({ ...userCredentails, emailId: e.target.value })} />
                </div>
                <div className="form__content_label">Password <Link to="/forgot-password">Forgot password?</Link></div>
                <div className="form__content_input">
                    <input type="password" placeholder="Password" value={userCredentails.password} onChange={(e) => setUserCredentials({ ...userCredentails, password: e.target.value })} />
                </div>
            </div>
            <div className="form__policy">
                Zoom is protected by reCAPTCHA and the Privacy Policy and Terms of Service apply.
            </div>
            <div className="form__submit">
                <div className="form__submit-btn" onClick={onSubmitHandler}>
                    Sign In
                </div>
            </div>
            <div className="form__footer">
                New to Zoom? <Link to='/sign-up'>
                    Sign Up Free
                </Link>
            </div>
        </div>
    )
}

export default Login
