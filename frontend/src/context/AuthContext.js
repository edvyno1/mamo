import React, { useState, createContext, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState();
  const ACCESS_TOKEN = "access_token";

  useEffect(() => {
    const storageToken = sessionStorage.getItem(ACCESS_TOKEN);

    if (!token && storageToken) {
      setToken(storageToken);
    }

    sessionStorage.setItem(ACCESS_TOKEN, token);
  }, [token]);

  const addToken = (access_token) => {
    setToken(access_token);
  };

  return <AuthContext.Provider value={{ token, addToken }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
