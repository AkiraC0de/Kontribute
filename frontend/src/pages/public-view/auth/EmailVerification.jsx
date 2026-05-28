import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
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
    <div className="flex justify-center mt-15">
      <div className="bg-white w-full lg:w-120  rounded-md shadow-custom animate-fade-up duration-300">
        aa
      </div>
    </div>
  )
}
export default EmailVerification