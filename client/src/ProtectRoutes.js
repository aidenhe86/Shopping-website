import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserContext from "./auth/UserContext";
import Toast from "./common/Toast";

// use Outlet to protect all the private routes
const ProtectRoutes = () => {
  // render to wait to read currentUser data
  const [render, setRender] = useState(false);

  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!render) setRender(true);
    else {
      if (!currentUser) {
        Toast("Please Login!", "error");
        navigate("/");
      }
    }
  }, [render, currentUser, navigate]);
  return <Outlet />;
};

export default ProtectRoutes;
