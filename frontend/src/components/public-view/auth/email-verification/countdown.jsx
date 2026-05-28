import { useEffect, useState } from "react"

const COOLDOWN_IN_SEC = 60;

const Countdown = () => {
  const [countdown, setCountdown] = useState(COOLDOWN_IN_SEC);

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
    
  }

  return (
    <div className="text-sm text-center my-5">
      {
        countdown 
        ? <>
            <span>resend OTP in </span>
             <span className="font-bold">{countdown}s</span>
          </>
        : <button className="font-medium hover:underline">
            Resend OTP
          </button>
      }
    </div>
  )
}
export default Countdown