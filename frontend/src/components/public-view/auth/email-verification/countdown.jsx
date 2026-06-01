import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import authService from "../../../../services/api/authService";

const COOLDOWN_IN_SEC = 60;

const Countdown = ({setError}) => {
  const [countdown, setCountdown] = useState(COOLDOWN_IN_SEC);
  const { sessionToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) return;

    const countdownInterval = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(countdownInterval);
    };
  }, [countdown]);

  const handleResend = async () => {
    try {
      const data = await authService.resendEmailVerification(sessionToken);
      navigate(`/auth/email-verification/${data.sessionToken}`, { replace: true, state: { newVerification: true }})
      setCountdown(COOLDOWN_IN_SEC)
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  }

  return (
    <div className="text-sm text-center my-5">
      {
        countdown 
        ? <>
            <span>resend OTP in </span>
             <span className="font-bold">{countdown}s</span>
          </>
        : <button onClick={handleResend} type="button" className="font-medium hover:underline cursor-pointer">
            Resend OTP
          </button>
      }
    </div>
  )
}
export default Countdown