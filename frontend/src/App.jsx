import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router"; 
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./services/store/authSlice";

// Guards
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
import About from "./pages/public-view/About";
import Features from "./pages/public-view/Features";
import FullPageSpinner from "./components/common/FullPageSpinner";
import SetUp from "./pages/main-view/account/SetUp";


function App() {
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in immediately when the tab loads/refreshes
    dispatch(checkAuth());
  }, [dispatch]);

  if(isAuthenticating){
    return <FullPageSpinner/>
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/auth/email-verification/:sessionToken" element={<EmailVerification/>}/>
        </Route>
      </Route>

      <Route path="/main/account/set-up/:sessionToken" element={<SetUp />}/>

      <Route path="/main" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
        {/* <Route path="account">
          
        </Route> */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
