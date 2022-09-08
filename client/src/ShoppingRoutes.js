import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import CategoryList from "./categories/CategoryList";
// import CompanyDetail from "../companies/CompanyDetail";
// import JobList from "../jobs/JobList";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
// import UserForm from "../users/UserForm";
import NotFound from "./NotFound";
import ProtectRoutes from "./ProtectRoutes";

// routes for the website
function ShoppingRoutes({ login, signup }) {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
      <Route element={<ProtectRoutes />}>
        {/* <Route path="/profile" element={<UserForm />} /> */}
        <Route path="/categories">
          <Route index element={<CategoryList />} />
          {/* <Route path=":handle" element={<CompanyDetail />} /> */}
        </Route>
        {/* <Route path="/jobs">
          <Route index element={<JobList />} />
        </Route> */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default ShoppingRoutes;
