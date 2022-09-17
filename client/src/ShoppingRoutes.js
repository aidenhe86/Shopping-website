import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import UserForm from "./users/UserForm";
import Success from "./items/Success";
import Cancel from "./items/Cancel";
import NotFound from "./NotFound";
import ProtectRoutes from "./ProtectRoutes";

// routes for the website
function ShoppingRoutes({ login, signup }) {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
      <Route path="/items/:id/success" element={<Success />} />
      <Route path="/items/cancel" element={<Cancel />} />
      <Route element={<ProtectRoutes />}>
        <Route path="/profile" element={<UserForm />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default ShoppingRoutes;
