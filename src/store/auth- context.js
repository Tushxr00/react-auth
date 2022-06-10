import React, { useCallback, useEffect, useState } from "react"

let logoutTimer;

const AuthContext = React.createContext({
    token: "",
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
});

const calculateRemaingTime = (expirationTime) => {
    const currentTime = new Date().getTime()
    const adjExpirationTime = new Date(expirationTime).getTime()
    const remainingDuration = adjExpirationTime - currentTime

    return remainingDuration
}

const retriveStoredToken = () => {
    const storedToken = localStorage.getItem("token")
    const storedExpirationTime = localStorage.getItem("endTime")

    const remainingTime = calculateRemaingTime(storedExpirationTime)
    if (remainingTime <= 6000) {
        localStorage.removeItem("token")
        localStorage.removeItem("endTime")
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
    if (tokenData) {
        initialToken = tokenData.token
    }
    const [token, setToken] = useState(initialToken)

    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("endTime")
        if (logoutTimer) {
            clearTimeout(logoutTimer)
        }
    },[])

    const loginHandler = (token, expirationTime) => {
        setToken(token)
        localStorage.setItem("token", token)
        localStorage.setItem("endTime", expirationTime)

        const remainingTime = calculateRemaingTime(expirationTime)

        logoutTimer = setTimeout(loginHandler, remainingTime)
    };

    useEffect(() => {
        if (tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration)
        }
    }, [tokenData,logoutHandler])


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