import { useEffect, useState } from "react";
import Countdown from "../../../../components/public-view/auth/email-verification/countdown"
import PrimaryButton from "../../../ui/PrimaryButton";
import Spinner from "../../../common/Spinner";
import authService from "../../../../services/api/authService";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../services/store/authSlice";

const Form = () => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { sessionToken } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleChange = (e, index) => {
    setError("")
    const value = e.target.value;
  
    if (!/^\d{1,2}$/.test(value)) return;

    const digit = value.slice(-1);

    if(pin[index] == ""){
      setPin(prev =>  prev.map((item, i) => (i === index ? digit : item)));
    } else {
      setPin(prev => prev.map((item, i) => (i === index + 1 ? digit : item)));
    }

    if (digit && index < pin.length - 1) {
      e.target.nextElementSibling?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!pin[index] && index > 0) {
        e.target.previousElementSibling?.focus();
      } else {
        setPin(prev =>
          prev.map((item, i) => (i === index ? "" : item))
        );
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const pins = pin.join("");
    const isPinsValid = pins.length == 6;
    if (!isPinsValid) return setError("Complete the 6 digit pin.");

    setIsLoading(true);
    try {
      const data = await authService.verifyEmail(pins, sessionToken);
      dispatch(setUser(data.user));
      navigate("/main/account/set-up", { replace: true });
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false);
    }
  } 

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center gap-2.5">
        {pin.map((_,index) => (
          <input
            key={index}
            type="text"
            value={pin[index]}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            autoFocus={index == 0 ? true : false}
            onKeyDown={e => handleKeyDown(e, index)}
            onChange={e => handleChange(e, index)}
            className={`
              border-2 text-xl lg:text-2xl text-center font-extrabold w-10 h-14 lg:w-12 lg:h-15 rounded-md
              ${error ? "border-red-500" : "border-gray-300"}
            `}
          />
        ))}
      </div>
      <Countdown setError={setError}/>
      {error && <p className="text-red-500 text-sm text-center my-4">{error}</p>}
      <PrimaryButton disabled={isLoading} className="w-full mt-5 flex justify-center items-center" type="submit">
        {isLoading ? <Spinner color="bg-white"/> : "Verify"}
      </PrimaryButton>
    </form>
  )
}
export default Form