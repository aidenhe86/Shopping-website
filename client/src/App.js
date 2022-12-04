import React, { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Navbar";
import ShoppingRoutes from "./ShoppingRoutes";
import useLocalStorageState from "./hooks/useLocalStorageState";
import useGetUser from "./hooks/useGetUser";
import UserContext from "./auth/UserContext";
import ShoppingApi from "./api";
import Loading from "./Loading";
import "./App.css";

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
  const [cart, setCart] = useLocalStorageState("userShopcart");
  const getUser = useGetUser();

  // get current user when first load and whenever token changed
  useEffect(() => {
    // get current user, if no user return null
    const getCurrentUser = async () => {
      setIsLoading(true);
      if (token) {
        try {
          let { username } = decodeToken(token);
          ShoppingApi.token = token;
          let res = await getUser(username);
          setCurrentUser(res.user);
        } catch (e) {
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };
    getCurrentUser();
    if (cart === null) setCart({});
    // eslint-disable-next-line
  }, [token]);

  // handle login
  const login = async (data) => {
    try {
      let token = await ShoppingApi.login(data);
      setToken(token);
      return { success: true };
    } catch (e) {
      return { success: false, e };
    }
  };

  // handle sign up
  const signup = async (data) => {
    try {
      let token = await ShoppingApi.signup(data);
      setToken(token);
      return { success: true };
    } catch (e) {
      return { success: false, e };
    }
  };

  // handle log out
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  // make api calls to  purchase
  const purchase = async (id, amt) => {
    await ShoppingApi.purchase(id, amt);
  };

  if (isLoading) return <Loading />;

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{ currentUser, setCurrentUser, purchase, cart, setCart }}
      >
        <Navbar logout={logout} />
        <div className="App">
          <ShoppingRoutes login={login} signup={signup} />
          <ToastContainer />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
