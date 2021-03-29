import React, { useReducer } from 'react'
import {
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_LOGOUT_SUCCESS,
    USER_LOGOUT_FAILURE,
    USER_SIGNUP_FAILURE,
    USER_SIGNUP_SUCCESS,
    USER_ACCOUNT_ACTIVATION_SUCCESS,
    USER_ACCOUNT_ACTIVATION_FAILURE
} from './user-actions';
import { UserContext } from './user-context';
import { userReducer } from './user-reducer';
import { axiosInstance } from '../../axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import jwt from "jsonwebtoken";

function UserProvider(props) {

    const axios = axiosInstance();

    const initialState = {
        isLoggedIn: false,
        token: '',
        error: '',
        user: {},
    }
    const [state, dispatch] = useReducer(userReducer, initialState);
    const history = useHistory();

    const logInUser = async ({ emailId, password }, redirectPath = "/") => {
        try {
            const result = await axios.post('/user/login', {
                emailId,
                password
            });
            localStorage.setItem('token', result.data.token);
            toast.success(result.data.message);
            history.push(redirectPath);
            dispatch({ type: USER_LOGIN_SUCCESS, payload: result.data })
        } catch (err) {
            toast.error(err.response.data.message);
            dispatch({ type: USER_LOGIN_FAILURE })
        }
    }

    const logOutUser = () => {
        try {
            localStorage.removeItem('token');
            dispatch({ type: USER_LOGOUT_SUCCESS });
            toast.success('Logout Successfull');
        } catch (err) {
            dispatch({ type: USER_LOGOUT_FAILURE })

        }
    }

    const signUpUser = async ({ emailId, password, confirmPassword, username }) => {
        try {
            const result = await axios.post('/user/sign-up', {
                emailId,
                password,
                confirmPassword,
                username
            });
            toast.success(result.data.message);
            dispatch({ type: USER_SIGNUP_SUCCESS });

        } catch (err) {
            toast.error(err.response.data.message);
            dispatch({ type: USER_SIGNUP_FAILURE });
        }
    }

    const activateAccount = async (activationToken) => {
        try {
            const result = await axios.post(`/user/activate-account/${activationToken}`);
            toast.success(result.data.message);
            history.push('/sign-in');
            dispatch({ type: USER_ACCOUNT_ACTIVATION_SUCCESS })
        } catch (err) {
            toast.error(err.response.data.message);
            dispatch({ type: USER_ACCOUNT_ACTIVATION_FAILURE })
        }
    }

    const retrievePassword = async (emailId) => {
        try {
            const result = await axios.post('/user/forgot-password', {
                emailId
            });
            toast.success(result.data.message);
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    const resetPassword = async (password, confirmPassword) => {
        try {
            const result = await axios.post('/user/reset-password', {
                password,
                confirmPassword
            });
            history.push('/sign-in');
            toast.success(result.data.message);
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    const isUserLoggedIn = async () => {
        try {
            const axios = axiosInstance();
            const result = await axios.get('/user/isUserLoggedIn');
            dispatch({ type: USER_LOGIN_SUCCESS, payload: result.data });
            return true;
        } catch (err) {
            dispatch({ type: USER_LOGIN_FAILURE });
            return false;
        }
    }
    return (
        <UserContext.Provider value={{ userState: state, logInUser, logOutUser, signUpUser, activateAccount, retrievePassword, resetPassword, isUserLoggedIn }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserProvider
