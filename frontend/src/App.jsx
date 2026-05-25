import { useState } from "react";
import { Route, Routes } from "react-router";
import Landing from "./pages/public-view/Landing";
import NotFound from "./pages/public-view/NotFound";
import Home from "./pages/public-view/Home";
import PublicLayout from "./components/public-view/layout";
import MainLayout from "./components/main-view/Layout";
import Dashboard from "./pages/main-view/Dashboard";
import { Navigate } from "react-router";
import CheckAuth from "./components/common/CheckAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Landing />} />
        <Route path="/home" element={<Home />} />
      </Route>

      <Route path="/main"
        element={
          <CheckAuth>
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
