import {ADD_CONSULT_REQUEST, REMOVE_CONSULT_REQUEST, SET_PATIENT_ID, UPDATE_DIAGNOSIS} from "../actions/doctorActions.js";

let defaultState = {
    consultRequests : [],
    patientID : "",
    patientDiagnosis: null
}


const doctorReducer = (state=defaultState, action) => {

    switch (action.type) {
        case UPDATE_DIAGNOSIS:
            return {...state, patientDiagnosis: {...action.data}}
        case SET_PATIENT_ID:
            return {...state, patientID: action.data}
        case REMOVE_CONSULT_REQUEST:
            let filteredConsults = state.consultRequests.filter((req,i) => {
                if(action.data){
                    if(req.senderName === action.data){
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    
                    if(req.mySocketId === action.patientID){
                   
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                
            })
            return {...state, consultRequests: [...filteredConsults]}
            
        case ADD_CONSULT_REQUEST:
            let arr = state.consultRequests;
           // arr.push(data.action);
            //state.consultRequests.push(action.data);
            let filteredArr = state.consultRequests.filter((req,i) => {
                if(req.senderName === action.data.senderName){
                    return false;
                }
                else {
                    return true;
                }
            })
            
            return {...state, consultRequests: [...filteredArr, action.data]}
        default :
            return {...state}
    }
}


export default doctorReducer;