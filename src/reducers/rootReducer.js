import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";

import doctorReducer from "./doctorReducer.js";
import diagnosisReducer from "./diagnosisReducer.js";
import questionsReducer from "./questionsReducer.js";

import socketReducer from "./socketReducer.js";
import signUpReducer from "./signUpReducer.js";
import signInReducer from "./signInReducer.js";
import chatBubbleReducer from "./chatBubbleReducer.js";

export const rootReducer = combineReducers({
    signUpReducer,
    signInReducer,
    socketReducer,
    doctorReducer,
    chatBubbleReducer,
    diagnosisReducer,
    questionsReducer
});

export default rootReducer;