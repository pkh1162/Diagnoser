import {RECEIVED_SYMPTOMS, RETRIEVE_SYMPTOMS, CLEAR_RESULTS} from "../actions/diagnosisActions.js";

const defaultState = {
    mappedSymptoms : [],
    symptomsAvailable: false,
    noResults: false,
    gender: "",
    age: 0,
    present: [],
    absent: [],
    unknown: [],
    rateLimit: false,
    loading: false
}


const filterFunc = (symptom, symptomStatus) => {
    return symptom.choice_id === symptomStatus; 
}

const sortSymptoms = (symptoms) => {
    let sorted = {}
    sorted.present = symptoms.filter(x => x.choice_id === "present");
    sorted.absent = symptoms.filter(x => x.choice_id === "absent");
    sorted.unknown = symptoms.filter(x => x.choice_id === "unknown");
    return sorted;
}

const diagnosisReducer = (state=defaultState, action) => {
    switch (action.type) {
        case CLEAR_RESULTS:
            return {...state,
                        loading: false,
                        symptomsAvailable: false,
                        mappedSymptoms: [],
                        present: [],
                        unknown: [],
                        absent: [],
                        noResults: false    
            }
        case RETRIEVE_SYMPTOMS:
            return {...state, age: action.age, gender: action.gender, loading: true, rateLimit: false}
        case RECEIVED_SYMPTOMS:
            if(action.data.mentions.length === 0){
                if(action.data.rateLimit){
                    return {...state, noResults: true, rateLimit: action.data.rateLimit}
                }
                else {
                    return {...state, noResults: true}
                }
                
            }
            let sortedSymptoms = sortSymptoms(action.data.mentions);
            return {...state, 
                        loading: false,
                        symptomsAvailable: true, 
                        noResults: false,
                        mappedSymptoms: [...action.data.mentions], 
                        present: [...sortedSymptoms.present],
                        absent: [...sortedSymptoms.absent],
                        unkown: [...sortedSymptoms.unknown]
            }
        default:
            return {...state}
    }
}

export default diagnosisReducer;