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
import UpdateIngredient from "./pages/user/ingredients/EditIngredient";
import DeleteIngredient from "./pages/user/ingredients/DeleteIngredient";
import GetIngredients from "./pages/user/ingredients/GetIngredients";
import CreateDish from "./pages/user/dishes/CreateDish";
import EditDish from "./pages/user/dishes/EditDish";
import DetailsDish from "./pages/user/dishes/DetailsDish";
import DeleteDish from "./pages/user/dishes/DeleteDish";
import GetDishes from "./pages/user/dishes/GetDishes";
import ShoppingCart from "./pages/user/ShoppingCart";
import GroceryLists from "./pages/user/groceryLists/GroceryLists";
import DetailsGroceryList from "./pages/user/groceryLists/DetailsGroceryList";

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
              <Route index element={<GetIngredients />} />
              <Route path="add" element={<CreateIngredient />} />
              <Route path="edit/:id" element={<UpdateIngredient />} />
              <Route path="delete/:id" element={<DeleteIngredient />} />
            </Route>
            <Route path="/dishes">
              <Route index element={<GetDishes />} />
              <Route path="add" element={<CreateDish />} />
              <Route path="edit/:id" element={<EditDish />} />
              <Route path="details/:id" element={<DetailsDish />} />
              <Route path="delete/:id" element={<DeleteDish />} />
            </Route>
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="grocerylists">
              <Route index element={<GroceryLists />} />
              <Route path=":id/ingredients" element={<DetailsGroceryList />} />
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