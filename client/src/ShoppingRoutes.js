import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./Homepage";
import Homepage2 from "./Homepage2";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import UserForm from "./users/UserForm";
import Success from "./items/Success";
import Cancel from "./items/Cancel";
import ShopcartList from "./shopcarts/ShopcartList";
import CategoryList from "./categories/CategoryList";
import NotFound from "./NotFound";
import ProtectRoutes from "./ProtectRoutes";

// routes for the website
function ShoppingRoutes({ login, signup, currentUser }) {
  return (
    <Routes>
      <Route path="/" element={currentUser ? <Homepage2 /> : <Homepage />} />
      <Route
        path="/login"
        element={
          currentUser ? <Navigate to="/" /> : <LoginForm login={login} />
        }
      />
      <Route
        path="/signup"
        element={
          currentUser ? <Navigate to="/" /> : <SignupForm signup={signup} />
        }
      />
      <Route element={<ProtectRoutes />}>
        <Route path="/shop" element={<CategoryList />} />
        <Route path="/items/success" element={<Success />} />
        <Route path="/items/cancel" element={<Cancel />} />
        <Route path="/profile" element={<UserForm />} />
        <Route path="/shopcart" element={<ShopcartList />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default ShoppingRoutes;
