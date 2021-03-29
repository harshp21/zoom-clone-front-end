import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

function Join() {

    const [meetingId, setMeetingId] = useState('');
    const history = useHistory();

    const onJoinRoomHandler = () => {
        history.push(`/meeting/${meetingId}`);
    }

    return (
        <div className="form">
            <div className="form__title">
                Join a Meeting
            </div>
            <div className="form__content">
                <div className="form__content_label">Meeting Id</div>
                <div className="form__content_input">
                    <input type="text" placeholder="Enter the meeting Id" value={meetingId} onChange={(e) => setMeetingId(e.target.value)} />
                </div>

            </div>
            <div className="form__policy">
                Zoom is protected by reCAPTCHA and the Privacy Policy and Terms of Service apply.
            </div>
            <div className="form__submit">
                <div className="form__submit-btn" onClick={onJoinRoomHandler}>
                    Join Meeting
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

export default Join
