import {SIGN_USER_IN, CLEAR_ERRORS, GET_DOCTOR_LIST} from "../actions/signInActions";
import {AUTH_CHECK} from "../actions/authActions";
import {UPDATE_FORM_ERRORS} from "../actions/signUpActions";
import {SET_USER} from "../actions/strategyActions.js";

const defaultState = {
    userSession: false,
    errors: {},
    user: {},
    userType : "user",
    status: "",
    doctors : [],
    consultRequests: []
}


const signInReducer = (state=defaultState, action) => {
    switch(action.type) {
        case SIGN_USER_IN: 
            return { ...state, userSession: action.userSession, user: action.userData, userType: action.userData.privilege, status: action.userStatus};
        case GET_DOCTOR_LIST: 
            return {...state, doctors: action.doctors.data}
        case UPDATE_FORM_ERRORS: 
            return { ...state, errors: action.data};
        case AUTH_CHECK:
            return {...state, userSession: action.userSession, user: action.userData, userType: action.userData.privilege}
        case SET_USER:
            return {...state, user: action.userInfo}
        case CLEAR_ERRORS: 
            return {...state, errors: {}}
        default: 
            return {...state};
    }
}

export default signInReducer;