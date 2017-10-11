import {INIT_SOCKET} from "../actions/socketActions";

let defaultState = {
    socket: {},
    socketID: ""
}

const socketReducer = (state=[defaultState], action) => {
    switch(action.type) {
        case INIT_SOCKET:
            return {...state, socket: action.data};
        default:
            return state
    }
}

export default socketReducer;