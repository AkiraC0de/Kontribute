import LoginForm from "../../../components/public-view/auth/login&register/loginForm"
import AuthHero from "../../../components/public-view/auth/login&register/hero";
import AuthHeader from "../../../components/public-view/auth/login&register/header";
import AuthFooter from "../../../components/public-view/auth/login&register/footer";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Login = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const mode = "login";

  useEffect(() => {
    if(isAuthenticated){
      navigate("/main/dashboard", {replace: true})
    }
  }, [])

  return (
    <div className="flex-1 flex justify-center items-start my-10">
      <div className="flex  w-full max-w-110 lg:max-w-none lg:w-240 bg-white rounded-xl overflow-hidden shadow-custom animate-fade-up duration-300">
        <AuthHero mode={mode}/>
        <div className="flex-1 px-8 py-12">
          <AuthHeader mode={mode}/>
          <LoginForm />
          <AuthFooter mode={mode}/>
        </div>
      </div>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>  
    </div>
  );
};
export default Login;
