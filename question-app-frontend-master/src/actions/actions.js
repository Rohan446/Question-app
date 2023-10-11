export const login = (isLoggedIn) => {
    return {
        type:"SIGN_IN",
        payload : isLoggedIn
    }
}

export const addUser = (user) => {
    return {
        type:"ADD",
        payload : user
    }
}