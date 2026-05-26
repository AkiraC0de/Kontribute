import { useState } from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import { publicLoginControls, publicRegisterControls } from "../../../services/utils/config";
import Input from "../../ui/Input";
import { Link } from "react-router";

const RegisterForm = () => {
  const [formData, setFormData] = useState({});

  return (
    <form className="min-w-100">
      {publicRegisterControls.map((control) => (
        <Input
          key={control.label}
          id={control.label}
          className="mt-5"
          label={control.label}
          type={control.type}
          placeholder={control.placeholder}
        />
      ))}
      <div className="mt-5 text-end">
        <Link to="auth/forgot-password">Forgot password?</Link>
      </div>
      <PrimaryButton className="w-full mt-5" type="submit">
        Create Account
      </PrimaryButton>
    </form>
  );
};
export default RegisterForm;
