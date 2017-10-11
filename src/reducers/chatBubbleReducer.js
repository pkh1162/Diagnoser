import {OPEN_CLOSE, ALTER_CHANNEL, INIT_BUBBLE, INIT_ROOM, ADD_MESSAGE, ADD_TYPER, REMOVE_TYPER, FAKE_CONNECT, LEAVE_CHAT, CLEAR_MESSAGES, UPDATE_REQUESTED_DOCTOR} from "../actions/chatBubbleActions"

let defaultState = {
    open: false,
    channel: "closed",
    patient: "",
    doctor: "",
    connection: false,
    roomName: "",
    messages: [],
    typers: [],
    doctorID: ""
}


const chatBubbleReducer = (state=defaultState, action) => {
    switch(action.type) {
        case UPDATE_REQUESTED_DOCTOR:
            return {...state, doctorID : action.data}
        case INIT_BUBBLE:
            return {...state, doctor: action.doctor, patient: action.patient}
        case INIT_ROOM:
            return {...state, connection: action.connection, roomName: action.roomName}
        case CLEAR_MESSAGES:
            return{...state, messages: []}    
        case LEAVE_CHAT: 
            return {...state, connection: false}
        case ADD_MESSAGE:
            console.log("in add message, chatbubble reducer: ", action)
            return {...state, messages: [...state.messages, action]}
        case ADD_TYPER:
            let filteredTypers = state.typers.filter(x => {
                if(x === action.typer){
                    return false
                }
                else{
                    return true;
                }
            })
            return {...state, typers: [...filteredTypers, action.typer]}
        case REMOVE_TYPER:
            let typerArr = state.typers.filter(x => {
                if (x === action.typer)
                    return false
                else
                    return true
            })
            return {...state, typers: [...typerArr]}
        case OPEN_CLOSE:
            let channelStatus = state.open ? false : true;
            return channelStatus ?
                {...state, open: channelStatus, messages: []}
                :
                {...state, open: channelStatus} 
        case FAKE_CONNECT:
            return {...state, connection: true}        
        case ALTER_CHANNEL:
            return {...state, channel: action.data};
        default:
            return state;
    }
}

export default chatBubbleReducer;