import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router"; 
import { useDispatch } from "react-redux";
import { checkAuth } from "./services/store/authSlice";

// Guards
import GuessRoute from "./components/common/GuessRoute";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Layouts
import PublicLayout from "./components/public-view/layout";
import MainLayout from "./components/main-view/Layout";

// Pages 
import Landing from "./pages/public-view/Landing";
import Login from "./pages/public-view/auth/Login";
import Register from "./pages/public-view/auth/Register";
import Dashboard from "./pages/main-view/Dashboard";
import Settings from "./pages/main-view/Settings";
import NotFound from "./pages/public-view/NotFound";
import EmailVerification from "./pages/public-view/auth/EmailVerification";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in immediately when the tab loads/refreshes
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      <Route element={
        <GuessRoute>
          <PublicLayout /> 
        </GuessRoute>}
      > 
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/email-verification/:sessionToken" element={<EmailVerification/>}/>
      </Route>

      <Route path="/main" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
