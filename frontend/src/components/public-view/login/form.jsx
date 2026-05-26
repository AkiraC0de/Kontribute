import { useState } from "react"
import PrimaryButton from "../../ui/PrimaryButton"
import { publicLoginControls } from "../../../services/utils/config";
import Input from "../../ui/Input";

const Form = () => {
  const [formData, setFormData] = useState({});

  return (
    <form className="min-w-100">
      {
        publicLoginControls.map(control => (
          <Input
            key={control.label}
            id={control.label}
            className="mt-5"
            label={control.label}
            type={control.type}
            placeholder={control.placeholder}
          />
        ))
      }
      <PrimaryButton
        className="w-full mt-10"
      >
        Log in
      </PrimaryButton>
    </form>
  )
}
export default Form