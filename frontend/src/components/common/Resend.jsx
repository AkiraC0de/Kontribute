import { useEffect, useState } from "react";

const Resend = ({resendHandler = () => {}, cooldown = 60, className = ""}) => {
  const [countdown, setCountdown] = useState(cooldown);

  useEffect(() => {
    if (countdown <= 0) return;

    const countdownInterval = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(countdownInterval);
    };
  }, [countdown]);

  const handleResend = () => {
    try {
      resendHandler();
      setCountdown(cooldown)
    } catch (error){

    }
  }

  return (
    <div className={`text-sm text-center my-5 ${className}`}>
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
export default Resend