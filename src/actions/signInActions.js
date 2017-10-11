import {updateFormErrors} from "./signUpActions.js";
export const SIGN_USER_IN = "SIGN_USER_IN";
export const CLEAR_ERRORS = "CLEAR_ERRORS";
export const GET_DOCTOR_LIST = "GET_DOCTOR_LIST";

export const signUserIn = (userSession, userData, userStatus) => {
    return {
        type: SIGN_USER_IN,
        userSession,
        userData,
        userStatus
    }
}

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
}

export const getDoctorList = (data) => {
    return {
        type: GET_DOCTOR_LIST,
        doctors: data
    }
}


export const retrieveDoctors = () => {
    return (dispatch) => {
        fetch("/api/retrieveDoctors", {credentials: "same-origin"})
        .then(response => {
            return response.json();
        })
        .then(data => {
            dispatch(getDoctorList(data));
        })
        .catch(err => console.log("catching retrievedoctors: ", err))
    }
}
    




export const handleSignIn = (form) => {

     let bodyObject = {
            usernameOrEmail: form.usernameOrEmail.value,
            password: form.password.value,
            
     }

    let myHeaders = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
    });

    return (dispatch) => {
        fetch(`/api/signin`,
            {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(bodyObject),
                credentials: "same-origin"

            })
            .then(data => {
                return data.json();
            })
            .then((data) => {
                if (data.errors){
                    dispatch(updateFormErrors(data.errors));
                }
                else{
                    dispatch(updateFormErrors({}))
                    if(data.userData.privilege === "user"){
                        dispatch(retrieveDoctors());
                    }
                    dispatch(signUserIn(data.userSession, data.userData, data.status));
                }

            })
            .catch((err)=>{
                console.log("error: ", err);
            }
        )

    }


}




