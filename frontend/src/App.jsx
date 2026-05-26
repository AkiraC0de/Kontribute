import { useState } from "react";
import { Route, Routes } from "react-router";
import Landing from "./pages/public-view/Landing";
import NotFound from "./pages/public-view/NotFound";
import PublicLayout from "./components/public-view/layout";
import MainLayout from "./components/main-view/Layout";
import Dashboard from "./pages/main-view/Dashboard";
import { Navigate } from "react-router";
import CheckAuth from "./components/common/CheckAuth";
import Login from "./pages/public-view/Login";
import Register from "./pages/public-view/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      </Route>

      <Route path="/main"
        element={
          <CheckAuth isAuthenticated={false}>
            <MainLayout />
          </CheckAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
