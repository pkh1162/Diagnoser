export const OPEN_CLOSE = "OPEN_CLOSE";
export const ALTER_CHANNEL = "ALTER_CHANNEL";
export const INIT_BUBBLE = "INIT_BUBBLE";
export const INIT_ROOM = "INIT_ROOM";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const ADD_TYPER = "ADD_TYPER";
export const REMOVE_TYPER = "REMOVE_TYPER";
export const LEAVE_CHAT = "LEAVE_CHAT";
export const CLEAR_MESSAGES = "CLEAR_MESSAGES";
export const UPDATE_REQUESTED_DOCTOR = "UPDATE_REQUESTED_DOCTOR";
export const FAKE_CONNECT = "FAKE_CONNECT";



export const fakeConnect = () => {
    return {
        type: FAKE_CONNECT
    }
}


export const updateRequestedDoctor = (data) => {
    return {
        type: UPDATE_REQUESTED_DOCTOR,
        data
    }
}


export const openClose = () => {
    return {
        type: OPEN_CLOSE
    }
}

export const alterChannel = (data) => {
    return {
        type: ALTER_CHANNEL,
        data
    }
}

export const clearMessages = () => {
    return {
        type: CLEAR_MESSAGES
    }
}


export const leaveChat = () => {
    return {
        type: LEAVE_CHAT,
    }
}

export const initBubble = (data) => {
    return {
        type: INIT_BUBBLE,
        doctor: data.doctor,
        patient: data.patient
    }
}

export const initRoom = (data) => {
    return {
        type: INIT_ROOM,
        connection: data.connection,
        roomName: data.roomName
    }
}

export const addMessage = (data) => {
    console.log("in add mesage action: ", data);
    return {
        type: ADD_MESSAGE,
        message: data.message,
        roomName: data.roomName,
        senderName: data.senderName,
        fileType: data.fileType || null,
        file: data.file || null
    }
}



export const addTyper = (data) => {
    return {
        type: ADD_TYPER,
        typer: data
    }
}

export const removeTyper = (data) => {
    return {
        type: REMOVE_TYPER,
        typer: data
    }
}