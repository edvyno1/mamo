import axios from "axios";
import React, { useState, createContext, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [role, setRole] = useState();
  const [token, setToken] = useState();
  const ACCESS_TOKEN = "access_token";

  useEffect(() => {
    const storageToken = sessionStorage.getItem(ACCESS_TOKEN);

    if (!token && storageToken) {
      setToken(storageToken);
    }

    if (token) {
      sessionStorage.setItem(ACCESS_TOKEN, token);
      fetchRole();
    }
  }, [token]);

  const fetchRole = () => {
    axios
      .get("http://localhost:5000/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRole(response.data.role);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addToken = (access_token) => {
    setToken(access_token);
  };

  return <AuthContext.Provider value={{ token, role, addToken }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
