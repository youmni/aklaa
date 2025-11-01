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
import Layout from "./components/layout/Layout";
import Logout from "./pages/shared/Logout";
import CreateIngredient from "./pages/user/ingredients/CreateIngredient";

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
          <Route element={<PrivateRoute allowedRoles={['USER', 'ADMIN']} />}>
            <Route path="/auth/logout" element={<Logout />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={['USER', 'ADMIN']} />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/ingredients">
              <Route path="create" element={<CreateIngredient />} />
            </Route>
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
          <Route element={<Layout />}>
            <Route path="/admin" element={<Home />} />
          </Route>
        </Route>

        <Route path="/not-found" element={<Layout><NotFound /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;