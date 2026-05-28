import { useEffect } from "react";
import { Route, Routes } from "react-router";
import Landing from "./pages/public-view/Landing";
import NotFound from "./pages/public-view/NotFound";
import PublicLayout from "./components/public-view/layout";
import MainLayout from "./components/main-view/Layout";
import Dashboard from "./pages/main-view/Dashboard";
import { Navigate } from "react-router";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/public-view/auth/Login";
import Register from "./pages/public-view/auth/Register";
import { useDispatch } from "react-redux";
import { checkAuth } from "./services/store/authSlice";
import GuessRoute from "./components/common/GuessRoute";
import Settings from "./pages/main-view/Settings";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in immediately when the tab loads/refreshes
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={
        <GuessRoute>
          <PublicLayout />
        </GuessRoute>
      }>
        <Route index element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      </Route>

      <Route path="/main"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
