import {signUserIn, SIGN_USER_IN} from "./signInActions.js";

export const SIGN_UP = "SIGN_UP";
export const UPDATE_FORM_ERRORS = "UPDATE_FORM_ERRORS"; 



export const signUp = (username, password) => {
    return {
        type: SIGN_UP,
        data: {username, password}
    }
}

export const updateFormErrors = (errors) => {
    return {
        type: UPDATE_FORM_ERRORS,
        data: errors
    }
}



export const handleSignUp = (form) => {

     let bodyObject = {
            username: form.username.value,
            email: form.email.value,
            password: form.password.value,
            passwordMatch: form.passwordMatch.value
    }

    let myHeaders = new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
    });

    return (dispatch) => {
        fetch(`/api/signup`,
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
                    dispatch(signUserIn(data.userSession, data.userData, data.status));
                }
            })
            .catch((err)=>{
                console.log("error: ", err);
            }
        )

    }


}



