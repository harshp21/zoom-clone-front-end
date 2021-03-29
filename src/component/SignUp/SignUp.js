import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/user/user-context';

function SignUp() {

    const [userCredentails, setUserCredentials] = useState({ emailId: '', password: '', confirmPassword: '', username: '' });
    const userContext = useContext(UserContext);

    const onSubmitHandler = () => {
        userContext.signUpUser(userCredentails);
    }
    return (
        <div className="form">
            <div className="form__title">
                Sign Up
            </div>
            <div className="form__content">
                <div className="form__content_label">Username</div>
                <div className="form__content_input">
                    <input type="email" placeholder="Username" value={userCredentails.username} onChange={(e) => setUserCredentials({ ...userCredentails, username: e.target.value })} />
                </div>
                <div className="form__content_label">Email Address</div>
                <div className="form__content_input">
                    <input type="email" placeholder="Email Address" value={userCredentails.emailId} onChange={(e) => setUserCredentials({ ...userCredentails, emailId: e.target.value })} />
                </div>
                <div className="form__content_label">Password </div>
                <div className="form__content_input">
                    <input type="password" placeholder="Password" value={userCredentails.password} onChange={(e) => setUserCredentials({ ...userCredentails, password: e.target.value })} />
                </div>
                <div className="form__content_label">Confirm Password </div>
                <div className="form__content_input">
                    <input type="password" placeholder="Confirm Password" value={userCredentails.confirmPassword} onChange={(e) => setUserCredentials({ ...userCredentails, confirmPassword: e.target.value })} />
                </div>
            </div>
            <div className="form__policy">
                Zoom is protected by reCAPTCHA and the Privacy Policy and Terms of Service apply.
        </div>
            <div className="form__submit">
                <div className="form__submit-btn" onClick={onSubmitHandler}>
                    Sign Up
            </div>
            </div>
            <div className="form__footer">
                Already have an Account? <Link to='/sign-in'>
                    Sign In
            </Link>
            </div>
        </div>
    )
}

export default SignUp
