import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import authService from "../../../services/api/authService";

const EmailVerification = () => {
  const { sessionToken } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isInternalFlow = location.state?.isValidSession;
  const [isValidating, setIsValidating] = useState(!isInternalFlow);
  const [pin, setpin] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    if (isInternalFlow) {
      return;
    }
    const verifyTokenOnFirstLoad = async () => {
      try {
        await authService.verifySessionToken(sessionToken);
        setIsValidating(false);
      } catch (error) {
        console.error("Invalid token on first load:", error.message);
        navigate("/auth/login", { replace: true });
      }
    };

    //verifyTokenOnFirstLoad();
  }, [sessionToken, isInternalFlow, navigate]);

  // if(isValidating){
  //   return <div>Loading...</div>
  // }

  return (
    <div className="flex-1 flex justify-center items-start my-10">
      <div className="flex w-full lg:w-240 p-4 bg-white rounded-md shadow-custom animate-fade-up duration-300">
        
      </div>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-ful bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>
    </div>
  );
};
export default EmailVerification;
