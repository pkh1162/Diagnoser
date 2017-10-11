export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";


export const setUser = (userInfo) => {
    return {
        type: SET_USER,
        userInfo
    }
}


