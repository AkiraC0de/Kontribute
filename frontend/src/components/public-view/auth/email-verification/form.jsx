import { useEffect, useState } from "react";
import PrimaryButton from "../../../ui/PrimaryButton";
import Spinner from "../../../common/Spinner";

const Form = () => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

  }, [])

  const handleChange = (e, index) => {
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
  
  const handleSubmit = (e) => {
    e.preventDefault()
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
            className="border-2 text-xl lg:text-2xl text-center font-extrabold w-10 h-14 lg:w-12 lg:h-15 rounded-md border-gray-300"
          />
        ))}
      </div>
      <PrimaryButton disabled={isLoading} className="w-full mt-5 flex justify-center items-center" type="submit">
        {isLoading ? <Spinner color="bg-white"/> : "Verify"}
      </PrimaryButton>
    </form>
  )
}
export default Form