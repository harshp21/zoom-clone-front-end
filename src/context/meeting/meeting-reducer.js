import {
    HOST_MEETING_FAILURE,
    HOST_MEETING_SUCCESS,
    JOIN_MEETING_FAILURE,
    JOIN_MEETING_SUCCESS,
    MEETING_CHAT_FETCH_FAILURE,
    MEETING_CHAT_FETCH_SUCCESS,
    MEETING_CHAT_MESSAGES,
    MEETING_LEAVE,
    MEETING_VIDEO_CONFIG_OPTIONS,
    SET_MEETING_PARTICIPANTS
} from "./meeting-action"

const meetingReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case HOST_MEETING_SUCCESS:
            return {
                ...state,
                meeting: payload
            }
        case JOIN_MEETING_SUCCESS:
            return {
                ...state,
                meeting: payload
            }

        case HOST_MEETING_FAILURE:
            return {
                ...state
            }
        case JOIN_MEETING_FAILURE:
            return {
                ...state
            }
        case SET_MEETING_PARTICIPANTS:
            return {
                ...state,
                users: payload
            }
        case MEETING_CHAT_FETCH_SUCCESS:
            return {
                ...state,
                chatMessages: payload
            }
        case MEETING_CHAT_FETCH_FAILURE:
            return {
                ...state,
            }
        case MEETING_VIDEO_CONFIG_OPTIONS:
            return {
                ...state,
                videoStreamingConfig: payload
            }
        case MEETING_CHAT_MESSAGES:
            return {
                ...state,
                chatMessages: payload
            }
        case MEETING_LEAVE:
            return {
                ...payload
            }
        default:
            return {
                ...state
            };
    }
}

export { meetingReducer };