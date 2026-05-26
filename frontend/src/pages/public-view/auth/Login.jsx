import LoginForm from "../../../components/public-view/auth/loginForm"
import AuthHero from "../../../components/public-view/auth/hero";
import AuthHeader from "../../../components/public-view/auth/header";
import AuthFooter from "../../../components/public-view/auth/footer";

const Login = () => {
  const mode = "login";
  return (
    <div className="flex-1 flex justify-center items-start mt-20">
      <div className="flex bg-white rounded-md shadow-[0_5px_30px_5px_rgba(0,0,0,0.15)] animate-fade-up duration-300">
        <AuthHero mode={mode}/>
        <div className="flex-1 px-15 py-18 xl:w-140">
          <AuthHeader mode={mode}/>
          <LoginForm />
          <AuthFooter mode={mode}/>
        </div>
      </div>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-ful bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>
    </div>
  );
};
export default Login;
