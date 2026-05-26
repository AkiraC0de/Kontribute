import { ChevronRight, ChevronLeft } from "lucide-react";
import SecondaryButton from "../../ui/SecondayButton";
import { Link } from "react-router";

// mode can be either "login" or "register"
const AuthFooter = ({ mode = "login" }) => {
  const isLoginMode = mode === "login";

  const dividerText = isLoginMode 
    ? "Don't have an account?" 
    : "Already have an account?";

  const buttonText = isLoginMode 
    ? "Create an account" 
    : "Sign in to your account";

  const linkTo = isLoginMode 
    ? "/auth/register" 
    : "/auth/login";

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-0.5 flex-1 bg-gray-300" />
        <span className="text-gray-500 whitespace-nowrap">{dividerText}</span>
        <div className="h-0.5 flex-1 bg-gray-300" />
      </div>

      <Link to={linkTo} className="block w-full">
        <SecondaryButton className="w-full flex justify-center items-center gap-2">
          {!isLoginMode && <ChevronLeft className="w-5 h-5" />}
          {buttonText}
          {isLoginMode && <ChevronRight className="w-5 h-5" />}
        </SecondaryButton>
      </Link>
    </div>
  );
};

export default AuthFooter;