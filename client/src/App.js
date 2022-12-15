import React, { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./Navbar";
import Sidecart from "./shopcarts/Sidecart";
import ShoppingRoutes from "./ShoppingRoutes";
import UserContext from "./auth/UserContext";
import Loading from "./Loading";
import Toast from "./common/Toast";

import useLocalStorageState from "./hooks/useLocalStorageState";
import useGetUser from "./hooks/useGetUser";
import useLogin from "./hooks/useLogin";
import useSignUp from "./hooks/useSignUp";

import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorageState("userToken");
  const [cart, setCart] = useLocalStorageState("userShopcart");
  const getUser = useGetUser();
  const loginAPI = useLogin();
  const signUpAPI = useSignUp();

  // get current user when first load and whenever token changed
  useEffect(() => {
    // get current user, if no user return null
    const getCurrentUser = async () => {
      setIsLoading(true);
      if (token) {
        try {
          let { username } = decodeToken(token);
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
      let token = await loginAPI(data);
      setToken(token);
      setStatus("login");
      return { success: true };
    } catch (e) {
      return { success: false, e };
    }
  };

  // handle sign up
  const signup = async (data) => {
    try {
      let token = await signUpAPI(data);
      setToken(token);
      setStatus("signup");
      return { success: true };
    } catch (e) {
      return { success: false, e };
    }
  };

  // handle log out
  const logout = () => {
    Toast("Successfully Signed Out!", "success");
    setToken(null);
    setCurrentUser(null);
  };

  if (isLoading) return <Loading />;
  // hard code background color
  document.body.style = "background: aliceblue;";
  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{
          currentUser,
          setCurrentUser,
          cart,
          setCart,
          status,
          setStatus,
        }}
      >
        <Navbar logout={logout} />
        <Sidecart cart={cart} setCart={setCart} currentUser={currentUser} />
        <div className="App">
          <ShoppingRoutes
            login={login}
            signup={signup}
            currentUser={currentUser}
          />
          <ToastContainer />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
