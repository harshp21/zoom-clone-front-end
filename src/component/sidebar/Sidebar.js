import React, { useContext, useState } from 'react'
import { MeetingContext } from '../../context/meeting/meeting-context'
import ChatMessages from '../Chat/Chat';
import Participant from '../Participant/Participant';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ReactMultiEmail } from 'react-multi-email';
import "react-multi-email/style.css";
import './sidebar.css'

function Sidebar({ streamConfig, onMessageSend, chatMessages }) {

    const meetingContext = useContext(MeetingContext);

    const handleOnInvite = () => {
        let inviteEmails = [];
        confirmAlert({
            title: 'Invite Link',
            message: 'Enter valid email id you want to send invite and press enter',
            buttons: [
                {
                    label: 'Send Invite',
                    onClick: () => {
                        meetingContext.inviteParticipants(inviteEmails, window.location.href);
                    },
                },
                {
                    label: 'cancel',
                }
            ],
            childrenElement: () => {
                return <ReactMultiEmail
                    placeholder="Input your Email Address"
                    emails={inviteEmails}
                    onChange={(emails) => {
                        inviteEmails = emails;
                    }}
                    getLabel={(
                        email,
                        index,
                        removeEmail
                    ) => {
                        return (
                            <div data-tag key={index}>
                                {email}
                                <span data-tag-handle onClick={() => removeEmail(index)}>
                                    ×</span>
                            </div>
                        );
                    }}
                />
            }
        })
    }

    return (
        <div className="sidebar">
            <div className="sidebar__participants-container">
                <div className="sidebar__participants-container_title"> Participants</div>
                <div className="sidebar__participants-container_content">
                    {meetingContext.meetingState.users.map(user => <Participant key={user.userId} user={user} streamConfig={streamConfig} />)}
                </div>
            </div>
            <div className="sidebar__invite">
                <div className="sidebar__invite_btn" onClick={handleOnInvite}>Invite</div>
            </div>
            <div className="sidebar__chat-container">
                <div className="sidebar__chat-container_title"> Chat</div>
                <div className="sidebar__chat-container_content">
                    <ChatMessages onMessageSend={(msg) => onMessageSend(msg)} chatMessages={chatMessages} />
                </div>
            </div>
        </div>
    )
}

export default Sidebar
