export const ADD_CONSULT_REQUEST = "ADD_CONSULT_REQUEST";
export const REMOVE_CONSULT_REQUEST = "REMOVE_CONSULT_REQUEST";
export const SET_PATIENT_ID = "SET_PATIENT_ID";
export const UPDATE_DIAGNOSIS = "UPDATE_DIAGNOSIS";

export const addConsultRequest = (data) => {
    return {
        type: ADD_CONSULT_REQUEST,
        data
    }
}

export const setPatientID = (data) => {
    return {
        type: SET_PATIENT_ID,
        data
    }
}


export const removeConsultRequest = (data, patientID=null) => {
    return {
        type: REMOVE_CONSULT_REQUEST,
        data,
        patientID
    }
}

export const updateDiagnosis = (data) => {
    return {
        type: UPDATE_DIAGNOSIS,
        data
    }
}