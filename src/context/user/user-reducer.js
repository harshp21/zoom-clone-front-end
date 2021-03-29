import {
    USER_LOGIN_SUCCESS,
    USER_LOGOUT_SUCCESS
} from "./user-actions";

const userReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                user: payload.user,
                isLoggedIn: true,
                token: payload.token,
            }
        case USER_LOGOUT_SUCCESS:
            return {
                ...state,
                user: {},
                token: '',
                isLoggedIn: false
            }

        default:
            return state;
    }
}

export { userReducer };