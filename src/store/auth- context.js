import React, { useEffect, useState } from "react"

let logoutTimer;

const AuthContext = React.createContext({
    token: "",
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
});

const calculateRemaingTime = (expirationTime) => {
    const currentTime = new Date().getTime("token")
    const adjustedExpirationTime = new Date(expirationTime).getTime()

    const remainingDuration = adjustedExpirationTime - currentTime

    return remainingDuration
}

const retriveStoredToken = () =>{
    const storedToken = localStorage.getItem("token")
    const storedExpirationTime = localStorage.getItem("expirationTIme")

    const remainingTime = calculateRemaingTime(storedExpirationTime)

    if (remainingTime <= 60000){
        localStorage.removeItem("token")
        localStorage.removeItem("expirationTIme")
        return null
    }
    return {
        token: storedToken,
        duration: remainingTime
    }
}

export const AuthContextProvider = (props) => {
    const tokenData = retriveStoredToken()
    let initialToken;
    if (tokenData){
        initialToken = tokenData.token
    }
    const [token, setToken] = useState(initialToken)

    const userIsLoggedIn = !!token;

    const logoutHandler = () => {
        setToken(null)
        localStorage.removeItem("token")
        if (logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }

    const loginHandler = (token, expirationTime) => {
        setToken(token)
        localStorage.setItem("token", token)
        localStorage.setItem("expirationTime" , expirationTime)

        const remainingTime = calculateRemaingTime(expirationTime)

        logoutTimer = setTimeout(loginHandler, remainingTime)
    }

    useEffect(()=>{
        if (tokenData){
            logoutTimer = setTimeout(logoutHandler,tokenData.duration)
        }
    },[tokenData])


    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext