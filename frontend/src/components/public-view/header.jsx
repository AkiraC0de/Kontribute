import { Link } from "react-router";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondayButton";
import Nav from "./nav";

const Header = () => {
  return (
    <header className="fixed inset-0 z-100 px-5 py-5 flex justify-between items-center bg-white h-20">
      <div>
        <Link to={"/"}>
          <h1 className="text-primary bg-white text-2xl font-extrabold tracking-tight">
            Kontribute
          </h1>
        </Link>
      </div>
      <Nav />
      <div className="space-x-4">
        <Link to="/auth/login">
          <SecondaryButton>Login</SecondaryButton>
        </Link>

        <Link to="/auth/register">
          <PrimaryButton>Register</PrimaryButton>
        </Link>
      </div>
    </header>
  );
};
export default Header;
