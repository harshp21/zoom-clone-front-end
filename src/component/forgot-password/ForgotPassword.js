import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/user/user-context';

function ForgotPassword() {

    const userContext = useContext(UserContext);
    const [email, setEmail] = useState('');

    const onSubmitHandler = () => {
        userContext.retrievePassword(email);
    }
    return (
        <div className="form">
            <div className="form__title">
                Forgot Password
            </div>
            <div className="form__content">
                <div className="form__content_label">Email Address</div>
                <div className="form__content_input">
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </div>
            <div className="form__policy">
                Zoom is protected by reCAPTCHA and the Privacy Policy and Terms of Service apply.
            </div>
            <div className="form__submit">
                <div className="form__submit-btn" onClick={onSubmitHandler}>
                    Retrieve Password
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

export default ForgotPassword
