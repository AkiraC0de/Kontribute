import { useLocation } from "react-router";

// mode can be either "login" or "register"
const AuthHeader = ({ mode = "login" }) => {
  const isLoginMode = mode === "login";
  const location = useLocation();

  const titleText = location.state?.from 
    ? "Login to continue" 
    : isLoginMode 
      ? "Welcome Back!" 
      : "Create Account";

  const subtitleText = isLoginMode 
    ? "Your projects are waiting for you" 
    : "Join Kontribute and start collaborating";

  return (
    <div className="text-center space-y-2 mb-12">
      <h1 className="text-4xl font-medium text-headline tracking-tight">
        {titleText}
      </h1>
      <h2 className="text-gray-600">
        {subtitleText}
      </h2>
    </div>
  );
};

export default AuthHeader;