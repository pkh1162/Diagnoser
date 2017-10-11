import {STORE_EVIDENCE, UPDATE_EVIDENCE, EXPAND_DIAGNOSIS, RECEIVED_DIAGNOSIS, SAVE_DIAGNOSIS} from "../actions/questionsActions.js";

const defaultState = {  
    evidence: [],
    loading: false,
    diagnosis: {},
    currentQuestion: null,
    diagnosisReached: false,
    finalDiagnosis: [],
    savedDiagnosis: null
}

const questionsReducer = (state=defaultState, action) => {
    switch(action.type) {
        case STORE_EVIDENCE:
            let evidenceArray = action.symptoms.mentions.map((item) => {
                return {
                    id: item.id,
                    choice_id: item.choice_id
                }
            });
            return {...state, evidence: [...evidenceArray]}
        case UPDATE_EVIDENCE:
            return {...state, evidence: [...action.symptoms]}
        case EXPAND_DIAGNOSIS:
            return {...state, loading: true}
        case RECEIVED_DIAGNOSIS:
            let diagnosisMade = false;
            let probableCauses = action.data.conditions.filter((x,i) => {
                return x.probability > 0.60
            })
            if (probableCauses.length > 0){
                diagnosisMade = true;
            }     
            return {...state, diagnosis: action.data, currentQuestion: action.data.question, diagnosisReached: diagnosisMade, finalDiagnosis: [...probableCauses]}
        case SAVE_DIAGNOSIS:
            return {...state, savedDiagnosis: {...action.data, condtions: [...action.conditions]}}
        default:
            return state
    }
}

export default questionsReducer;