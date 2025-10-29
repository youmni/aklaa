import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/shared/Register";
import Login from "./pages/shared/Login";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/user/Home";
import AccountActivation from "./pages/shared/AccountActivation";
import PasswordReset from "./pages/shared/PasswordReset";
import PasswordResetConfirm from "./pages/shared/PasswordResetConfirm";
import NotFound from "./pages/shared/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth">
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="activate" element={<AccountActivation />} />
          <Route path="password-reset" element={<PasswordReset />} />
          <Route path="password-reset/confirm" element={<PasswordResetConfirm />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['USER', 'ADMIN']} />}>
            <Route path="/" element={<Home />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<Home />} />
        </Route>
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;