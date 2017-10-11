export const STORE_EVIDENCE = "STORE_EVIDENCE";
export const UPDATE_EVIDENCE = "UPDATE_EVIDENCE";
export const EXPAND_DIAGNOSIS = "EXPAND_DIAGNOSIS";
export const RECEIVED_DIAGNOSIS = "RECEIVED_DIAGNOSIS";
export const SAVE_DIAGNOSIS = "SAVE_DIAGNOSIS";


export const savingDiagnosis = (data, conditions, targetCondition) => {
    return {
        type: SAVE_DIAGNOSIS,
        data,
        conditions,
        targetCondition
    }
}

export const gatherEvidence = (symptoms) => {
    return {
        type: STORE_EVIDENCE,
        symptoms
    }
}

export const updateEvidence = (symptoms) => {
    return {
        type: UPDATE_EVIDENCE,
        symptoms
    }
}

export const receivedDiagnosis = (data) => {
    return {
        type: RECEIVED_DIAGNOSIS,
        data
    }
}


export const expandDiagnosis = () => {
    return {
        type: EXPAND_DIAGNOSIS
    }
}


export const diagnose = (age, gender, evidence) => {

    return (dispatch) => {

        dispatch(expandDiagnosis());
        
        
        let myHeaders = new Headers({
            "Content-Type": "application/json",
            "App-Id": "df093881",
            "App-Key" : "fde8a804a4e7ae40a5dfb06a3f5fa935"
        })
        
        let query = {
            sex: gender,
            age,
            evidence,
            "extras": {"ignore_groups":true}
        }

        let reqObject = {
            method : "POST",
            headers: myHeaders,
            body: JSON.stringify(query)
        }

        fetch("https://api.infermedica.com/v2/diagnosis", reqObject)
            .then(res => res.json())
            .then(data => {
                dispatch(receivedDiagnosis(data))
            })
            .catch(err => console.log("problem occurred expandind diagnosis: ", err))

    }
    
}



export const saveDiagnosis = (conditions, evidence, targetCondition, gender, age) => {

    return (dispatch) => {
        
                //dispatch(expandDiagnosis());
                
                
                let myHeaders = new Headers({
                    "Content-Type": "application/json",
                    "App-Id": "df093881",
                    "App-Key" : "fde8a804a4e7ae40a5dfb06a3f5fa935"
                })
                
                let query = {
                    sex: gender,
                    age: age,
                    evidence: evidence,
                    target: targetCondition.id
                }
        
                let reqObject = {
                    method : "POST",
                    headers: myHeaders,
                    body: JSON.stringify(query)
                }
        
                fetch("https://api.infermedica.com/v2/explain", reqObject)
                    .then(res => res.json())
                    .then(data => {
                        dispatch(savingDiagnosis(data, conditions, targetCondition))

                    })
                    
                    .catch(err => console.log("problem occurred whilst explaining diagnosis: ", err))
                    
        
            }
            
}