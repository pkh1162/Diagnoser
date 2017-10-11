//import actions from "../actions/";
import { SIGN_UP, UPDATE_FORM_ERRORS, SIGN_USER_IN } from "../actions/signUpActions.js";
import { CLEAR_ERRORS } from "../actions/signInActions.js";


const defaultState = {
    username: "",
    password: "",
    errors: {},
    userSignedIn: false
};

const signUpReducer = (state=defaultState, action) => {
    switch(action.type) {
        case SIGN_UP : 
            let {username, password } = action.data;
            return { ...state, username: username, password: password};
        case UPDATE_FORM_ERRORS : 
            return { ...state, errors: action.data};
        case CLEAR_ERRORS : 
            return {...state, errors: {}}

        default: return state;
    }
}

export default signUpReducer;