import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserContext from "./auth/UserContext";
import Toast from "./common/Toast";

// use Outlet to protect all the private routes
const ProtectRoutes = () => {
  // render to wait to read currentUser data
  const [render, setRender] = useState(false);

  const { currentUser, status, setStatus } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!render) setRender(true);
    else {
      if (!currentUser) {
        Toast("Access unauthorized.", "error");
        navigate("/");
      } else if (status === "login") {
        Toast(
          `Welcome back ${currentUser.firstName} ${currentUser.lastName}!`,
          "success"
        );
        setStatus(null);
        navigate("/");
      } else if (status === "signup") {
        Toast(
          `Welcome New User ${currentUser.firstName} ${currentUser.lastName}!`,
          "success"
        );
        setStatus(null);
        navigate("/");
      }
    }
  }, [render, currentUser, navigate, status, setStatus]);
  return <Outlet />;
};

export default ProtectRoutes;
