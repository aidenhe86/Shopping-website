import React, { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import ShoppingRoutes from "./ShoppingRoutes";
import useLocalStorageState from "./hooks/useLocalStorageState";
import UserContext from "./auth/UserContext";
import ShoppingApi from "./api";
import Loading from "./Loading";

function App() {
  useEffect(() => {
    fetch("/api/ping")
      .then((resp) => resp.text())
      .then((text) => {
        console.log("Server status:", text);
      });
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorageState("userToken");
  const [shopList, setShopList] = useState(new Set([]));

  // get current user when first load and whenever token changed
  useEffect(() => {
    // get current user, if no user return null
    const getCurrentUser = async () => {
      setIsLoading(true);
      if (token) {
        try {
          let { username } = decodeToken(token);
          ShoppingApi.token = token;
          let currentUser = await ShoppingApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          setShopList(new Set(currentUser.shopList));
        } catch (e) {
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };
    getCurrentUser();
  }, [token]);

  const login = async (data) => {
    try {
      let token = await ShoppingApi.login(data);
      setToken(token);
      return { success: true };
    } catch (e) {
      return { success: false, e };
    }
  };
  const signup = async (data) => {
    try {
      let token = await ShoppingApi.signup(data);
      setToken(token);
      return { success: true };
    } catch (e) {
      return { success: false, e };
    }
  };
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  if (isLoading) return <Loading />;

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <Navbar logout={logout} />
        <div className="App">
          <ShoppingRoutes login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
