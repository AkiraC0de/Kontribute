import { ChevronRight } from "lucide-react";
import SecondaryButton from "../../ui/SecondayButton";
import { Link } from "react-router";

const Footer = () => {
  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-0.5 flex-1 bg-gray-300" />
        <span>Don't have an account? </span>
        <div className="h-0.5 flex-1 bg-gray-300" />
      </div>
      <Link to="/auth/register">
        <SecondaryButton className="w-full flex justify-center items-center gap-2">
          Create an account
          <ChevronRight/>
        </SecondaryButton>
      </Link>
    </div>
  );
};
export default Footer;
