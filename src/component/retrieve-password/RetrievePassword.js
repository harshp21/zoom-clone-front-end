import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/user/user-context'

function RetrievePassword() {

    const userContext = useContext(UserContext);
    const [userPassword, setUserPassword] = useState({ confirmPassword: '', password: '' });

    const onSubmitHandler = () => {
        userContext.resetPassword(userPassword);
    }
    return (
        <div className="form">
            <div className="form__title">
                Reset Password
        </div>
            <div className="form__content">
                <div className="form__content_label">Password</div>
                <div className="form__content_input">
                    <input type="password" placeholder="Password" value={userPassword.password} onChange={(e) => setUserPassword({ ...userPassword, password: e.target.value })} />
                </div>
                <div className="form__content_label">Confirm Password</div>
                <div className="form__content_input">
                    <input type="password" placeholder="Confirm Password" value={userPassword.confirmPassword} onChange={(e) => setUserPassword({ ...userPassword, confirmPassword: e.target.value })} />
                </div>
            </div>
            <div className="form__policy">
                Zoom is protected by reCAPTCHA and the Privacy Policy and Terms of Service apply.
        </div>
            <div className="form__submit">
                <div className="form__submit-btn" onClick={onSubmitHandler}>
                    Reset Password
            </div>
            </div>
            <div className="form__footer">
                Already have an account? <Link to='/sign-in'>
                    Sign In
            </Link>
            </div>
        </div>
    )
}

export default RetrievePassword
