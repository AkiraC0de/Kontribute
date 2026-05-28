import LoginForm from "../../../components/public-view/auth/login&register/loginForm"
import AuthHeader from "../../../components/public-view/auth/login&register/header";
import AuthFooter from "../../../components/public-view/auth/login&register/footer";
import AuthHero from "../../../components/public-view/auth/login&register/hero";
import RegisterForm from "../../../components/public-view/auth/login&register/registerForm";

const Register = () => {
  const mode = "register";
  return (
    <div className="flex-1 flex justify-center items-start my-10">
      <div className="flex w-full max-w-110 lg:max-w-none lg:w-240 bg-white rounded-xl overflow-hidden shadow-custom animate-fade-up duration-300">
        <AuthHero mode={mode}/>
        <div className="flex-1 px-8 py-12">
          <AuthHeader mode={mode}/>
          <RegisterForm />
          <AuthFooter mode={mode}/>
        </div>
      </div>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-ful bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>      
    </div>
  )
}
export default Register