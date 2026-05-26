import { Link } from "react-router";
import Form from "../../components/public-view/login/form";
import Hero from "../../components/public-view/login/hero";
import Input from "../../components/ui/Input";
import Header from "../../components/public-view/login/header";
import Footer from "../../components/public-view/login/footer";

const Login = () => {
  return (
    <div className="flex-1 flex justify-center items-start mt-20">
      <div className="flex bg-white rounded-md shadow-[0_5px_30px_5px_rgba(0,0,0,0.15)] animate-fade-up duration-300">
        <Hero />
        <div className="flex-1 px-15 py-18 xl:w-140">
          <Header/>
          <Form />
          <Footer/>
        </div>
      </div>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-ful bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>
    </div>
  );
};
export default Login;
