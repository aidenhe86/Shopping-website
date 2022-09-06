import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import UserContext from "../auth/UserContext";

// use Outlet to protect all the private routes
const ProtectRoutes = () => {
  // const { currentUser } = useContext(UserContext);
  const { currentUser } = "test";
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) navigate("/");
  }, []);
  return <Outlet />;
};

export default ProtectRoutes;
