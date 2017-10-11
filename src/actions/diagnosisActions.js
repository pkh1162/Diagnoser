import {gatherEvidence} from "./questionsActions.js";

export const RETRIEVE_SYMPTOMS = "RETRIEVE_SYMPTOMS";
export const RECEIVED_SYMPTOMS = "RECEIVED_SYMPTOMS";
export const CLEAR_RESULTS = "CLEAR_RESULTS";

export const retrieveSymptoms = (age, gender) => {
    return {
        type: RETRIEVE_SYMPTOMS,
        age,
        gender
    }
}

export const receivedSymptoms = (data) => {
    
    return {
        type: RECEIVED_SYMPTOMS,
        data
    }
}

export const clearResults = (data) => {
    
    return {
        type: CLEAR_RESULTS
    }
}

export const offerSymptoms = (symptoms, age, gender) => {
    return (dispatch) => {
        dispatch(retrieveSymptoms(age, gender));

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            "App-Id": "df093881",
            "App-Key" : "fde8a804a4e7ae40a5dfb06a3f5fa935"
         
        });

        let query = {
            text : symptoms
        }

        let tempObject = {
            method: "POST",
            body: JSON.stringify(query),
            headers: myHeaders
        }

        fetch("https://api.infermedica.com/v2/parse", tempObject)
            .then(res => res.json())
            .then(data => {
                if(data.message === "authentication failed"){
                    dispatch(receivedSymptoms({mentions:[], rateLimit: true}));
                
                }
                else {
                    dispatch(receivedSymptoms(data))
                    dispatch(gatherEvidence(data))
                }
                
            })
            .catch(err => console.log("error getting symptoms: ", err))


    }
}