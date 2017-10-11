export const AUTH_CHECK = "AUTH_CHECK";

export const authCheck = (userSession, userData) => {
    return {
        type: AUTH_CHECK,
        userSession,
        userData
    }
}


export const runAuthCheck = () => {
    return (dispatch) => {
        fetch("/api/authCheck", {
            method: "GET",
            credentials: "same-origin"
        })
            .then(res => {
                return res.json();
            })
            .then((isAuth) => {
                dispatch(authCheck(isAuth.userSession, isAuth.userData));
            })
            .catch(err => console.log("auth check error: ", err))
    }
}

export const logout = () => {
    return (dispatch) => {
        fetch("/api/logout", {
            method: "GET",
            credentials: "same-origin"
        })
        .then(res => res.json())
        .then(data => {
            dispatch(authCheck(data.userSession, data.userData))
            
        })
        .catch(err => console.log("in logout error: ", err))
    }
}