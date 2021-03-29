import { Avatar, IconButton } from '@material-ui/core'
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import React, { useContext } from 'react'
import { MeetingContext } from '../../context/meeting/meeting-context';
import { UserContext } from '../../context/user/user-context';
import './participant.css';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';

function Participant({ user, streamConfig }) {

    const { username, userId } = user;

    const meetingContext = useContext(MeetingContext);
    const userContext = useContext(UserContext);

    const isCurrentUser = userId === userContext.userState.user._id;
    const isHost = (userId === meetingContext.meetingState.meeting.hostId);

    const { videoStreamingConfig } = meetingContext.meetingState;

    const isAudioAllowed = isCurrentUser ? videoStreamingConfig.allowAudio : user.streamingOptions.allowAudio;
    const isVideoAllowed = isCurrentUser ? videoStreamingConfig.allowVideo : user.streamingOptions.allowVideo;
    const videoAvailable = isCurrentUser ? videoStreamingConfig.videoAvailable : user.streamingOptions.videoAvailable;
    const audioAvailable = isCurrentUser ? videoStreamingConfig.audioAvailable : user.streamingOptions.audioAvailable;

    const isScreenShareAllowed = !videoStreamingConfig.screenShareUserId || videoStreamingConfig.screenShareUserId === userContext.userState.user._id;
    const isScreenShareActive = videoStreamingConfig.screenShareUserId === userContext.userState.user._id;

    const displayName = `${username} ${(isHost) ? '(Host)' : ''} ${isCurrentUser ? '(Me)' : ''}`

    const handleOnAudioChange = () => {
        const { allowVideo, allowAudio, audioAvailable } = videoStreamingConfig;
        isCurrentUser && audioAvailable && streamConfig.reInitializeStream(allowVideo, !allowAudio);
    }

    const handleOnVideoChange = () => {
        const { allowVideo, allowAudio, videoAvailable } = videoStreamingConfig;
        isCurrentUser && videoAvailable && streamConfig.reInitializeStream(!allowVideo, allowAudio);
    }

    const handleOnScreenChange = () => {
        const { allowVideo, allowAudio } = videoStreamingConfig;
        isScreenShareActive && streamConfig.reInitializeStream(allowVideo, allowAudio);
        isScreenShareAllowed && !isScreenShareActive && streamConfig.reInitializeStream(allowVideo, allowAudio, 'displayMedia');
    }
    return (
        <div className="participant">
            <div className="participant__profile">
                <div className="participant__profile_image">
                    <Avatar />
                </div>
                <div className="participant__profile_username">{displayName}</div>
            </div>
            <div className="participant__action">
                <div className={audioAvailable ? "participant__action_audio" : "participant__action_audio disabled"}
                    onClick={handleOnAudioChange}>
                    <IconButton> {isAudioAllowed ? <MicIcon /> : <MicOffIcon />}</IconButton></div>
                <div className={videoAvailable ? "participant__action_video" : "participant__action_video disabled"} onClick={handleOnVideoChange}>
                    <IconButton> {isVideoAllowed ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton></div>
                <div className={isScreenShareAllowed ? "participant__action_video" : "participant__action_video disabled"} onClick={handleOnScreenChange}>
                    <IconButton> {isScreenShareActive ? <ScreenShareIcon /> : <StopScreenShareIcon />}</IconButton></div>
            </div>

        </div>
    )
}

export default Participant
