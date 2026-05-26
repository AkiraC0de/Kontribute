import { Link } from "react-router";
import Form from "../../components/public-view/login/form";
import Hero from "../../components/public-view/login/hero";
import Input from "../../components/ui/Input";
import SecondaryButton from "../../components/ui/SecondayButton";

const Login = () => {
  return (
    <div className="flex-1 flex justify-center items-start mt-20">
      <div className="flex bg-white rounded-md shadow-[0_5px_30px_5px_rgba(0,0,0,0.15)] animate-fade-up duration-300">
        <Hero />
        <div className="flex-1 px-15 py-18 xl:w-140">
          <div className="text-center space-y-2 mb-20">
            <h1 className="text-5xl font-medium text-primary">Welcome Back!</h1>
            <h2 className="text-lg">Your projects are waiting for you</h2>
          </div>
          <Form />
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-0.5 flex-1 bg-gray-300" />
              <span>Don't have an account? </span>
              <div className="h-0.5 flex-1 bg-gray-300" />
            </div>
            <SecondaryButton className="w-full">
              <Link to="/auth/register">Create an account</Link>
            </SecondaryButton>
          </div>
        </div>
      </div>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-ful bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>
    </div>
  );
};
export default Login;
