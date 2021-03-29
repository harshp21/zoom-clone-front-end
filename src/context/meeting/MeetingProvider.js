import React, { useReducer } from 'react'
import { MeetingContext } from './meeting-context'
import { axiosInstance } from '../../axios'
import { toast } from 'react-toastify';
import {
    HOST_MEETING_FAILURE,
    HOST_MEETING_SUCCESS,
    JOIN_MEETING_SUCCESS,
    JOIN_MEETING_FAILURE,
    SET_MEETING_PARTICIPANTS,
    MEETING_CHAT_FETCH_SUCCESS,
    MEETING_CHAT_FETCH_FAILURE,
    MEETING_VIDEO_CONFIG_OPTIONS,
    MEETING_CHAT_MESSAGES,
    MEETING_LEAVE
} from './meeting-action';
import { meetingReducer } from './meeting-reducer';
import { useHistory } from 'react-router-dom';

function MeetingProvider(props) {

    const initialState = {
        meeting: {
            meetingId: '',
            hostId: '',
            roomId: '',
        },
        users: [],
        chatMessages: [],
        videoStreamingConfig: {
            allowVideo: true,
            allowAudio: true,
            screenShare: false,
            screenAvailable: false,
            audioAvailable: false,
            videoAvailable: false,
            screenShareUserId: '',
        }
    }
    const [state, dispatch] = useReducer(meetingReducer, initialState);
    const history = useHistory();

    const hostMeeting = async () => {
        try {
            const axios = axiosInstance();
            const result = await axios.post('/meeting/host');
            toast.success(result.data.message);
            history.push(`/meeting/${result.data.meeting.roomId}`);
            dispatch({ type: HOST_MEETING_SUCCESS, payload: result.data.meeting });
        } catch (err) {
            history.push('/sign-in');
            toast.error(err.response.data.message);
            dispatch({ type: HOST_MEETING_FAILURE });
        }
    }

    const joinMeeting = async () => {
        try {
            const axios = axiosInstance();
            const result = await axios.post('/meeting/join');
            history.push(`/meeting/${result.data.meeting.roomId}`);
            dispatch({ type: JOIN_MEETING_SUCCESS, payload: result.data.meeting });
        } catch (err) {
            dispatch({ type: JOIN_MEETING_FAILURE });
        }
        return;
    }

    const setParticipants = (users) => {
        dispatch({ type: SET_MEETING_PARTICIPANTS, payload: users });
    }

    const fetchMeetingChat = async (roomId) => {
        try {
            const axios = axiosInstance();
            const result = await axios.get(`/meeting/chat/${roomId}`);
            dispatch({ type: MEETING_CHAT_FETCH_SUCCESS, payload: result.data.messages });
            return result.data.messages;
        } catch (err) {
            dispatch({ type: MEETING_CHAT_FETCH_FAILURE });
        }
        return;
    }

    const setVideoStreamOptions = (configOptions) => {
        dispatch({ type: MEETING_VIDEO_CONFIG_OPTIONS, payload: configOptions });
    }

    const setChatMessages = (newMessage) => {
        dispatch({ type: MEETING_CHAT_MESSAGES, payload: [...state.chatMessages, newMessage] });
    }

    const inviteParticipants = async (emailIds, inviteLink) => {
        try {
            const axios = axiosInstance();
            const result = await axios.post('/meeting/invite', {
                emailIds,
                inviteLink
            })
            toast.success(result.data.message);
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    const leaveMeeting = () => {
        dispatch({ type: MEETING_LEAVE, payload: initialState });
        history.push('/home');
    }

    return (
        <MeetingContext.Provider value={{ meetingState: state, hostMeeting, joinMeeting, setParticipants, fetchMeetingChat, setVideoStreamOptions, setChatMessages, inviteParticipants, leaveMeeting }}>
            {props.children}
        </MeetingContext.Provider>

    )
}

export default MeetingProvider
