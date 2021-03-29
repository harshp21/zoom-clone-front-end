import { IconButton } from '@material-ui/core';
import React, { useContext, useState, useRef, useEffect } from 'react'
import { MeetingContext } from '../../context/meeting/meeting-context';
import Message from '../message/message';
import './chat.css';
import SendIcon from '@material-ui/icons/Send';

function ChatMessages({ onMessageSend, chatMessages }) {

    const [message, setMessage] = useState('');

    const messageBodyRef = useRef(null);
    useEffect(() => {
        if (messageBodyRef) {
            messageBodyRef.current.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight });
            });
        }
    }, [])

    const onMessageSendHandler = () => {
        message && onMessageSend(message);
        setMessage('');
    }
    return (
        <div className="chat">
            <div className="chat__message-container" ref={messageBodyRef}>
                {chatMessages.map((chat, index) => {
                    return <Message key={index} message={chat} />
                })}
            </div>
            <div className="chat__footer">
                <div className="chat__foooter_input">
                    <input type="text" placeholder="Enter a message" value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <div className="chat__footer_submit-btn" onClick={onMessageSendHandler}>
                    <IconButton>
                        <SendIcon />
                    </IconButton></div>
            </div>
        </div >
    )
}

export default ChatMessages
