import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import authService from "../../../services/api/authService";
import Header from "../../../components/public-view/auth/email-verification/header";
import Form from "../../../components/public-view/auth/email-verification/form";
import FullPageSpinner from "../../../components/common/FullPageSpinner"

const EmailVerification = () => {
  const { sessionToken } = useParams();
  const navigate = useNavigate();

  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const verifyTokenOnFirstLoad = async () => {
      const [navigation] = performance.getEntriesByType('navigation');
      if (navigation && navigation.type !== 'reload') {
        setIsValidating(false);
        return;
      } 

      try {
        await authService.verifySessionToken(sessionToken);
      } catch (error) {
        console.error("Invalid token on first load:", error.message);
        navigate("/auth/register", { replace: true });
      } finally {
        setIsValidating(false);
      }
    };

    verifyTokenOnFirstLoad();
  }, [sessionToken, navigate]);

  if(isValidating){
    return <FullPageSpinner/>
  }

  return (
    <div className="flex-1 flex justify-center items-start my-10">
      <div className="flex flex-col w-full max-w-110 px-5 py-8 bg-white overflow-hidden rounded-xl shadow-custom animate-fade-up duration-300">
        <Header/>
        <Form/>
      </div>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-ful bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-size[4rem_4rem] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>
    </div>
  );
};
export default EmailVerification;
