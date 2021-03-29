import React, { useContext } from 'react'
import { MeetingContext } from '../../context/meeting/meeting-context';
import './home.css'

function Home() {

    const meetingContext = useContext(MeetingContext);
    return (
        <div className="home">
            <div className="home__container">
                <div className="home__container_header">
                    <div className="home-header_description">
                        <div className="description_title">A Recognized Magic Quadrant Leader!</div>
                        <div className="description_sub-title">
                            Zoom named a Leader in the 2020 Gartner Magic Quadrant for Meeting Solutions and a
                            Leader in the Magic Quadrant for UCaaS, Worldwide, connect us now on this magical journey and get connected globally
                        </div>
                        <div className="description_btn-container">
                            <div className="meeting-btn" onClick={() => meetingContext.hostMeeting()}>Host a Meeting</div>
                        </div>
                    </div>
                    <div className="home-header_image">
                        <img src="https://zoom.us/docs/image/together-herov2.jpg" alt='' />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home
