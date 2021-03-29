import React, { useContext } from 'react';
import { UserContext } from '../../context/user/user-context';
import DateUtilService from "../../service/date-util";
import './message.css';

function Message({ message }) {

    const userContext = useContext(UserContext);
    const recievedMessage = userContext.userState.user._id !== message.userId

    return (
        <div className={recievedMessage ? "chat__body_messages  message-recieved" : "chat__body_messages"} >
            <div className="message-title">
                <div className="message-title__name">{!recievedMessage ? 'You' : message.username}</div>
                <div className="message-title__timestamp">{DateUtilService.parseDateInGivenFormat(message.timestamp, 'dd/mm/yy - hh:MM:ss')}</div>
            </div>
            <div className="message-content">{message.message}</div>
        </div>
    )
}

export default Message
