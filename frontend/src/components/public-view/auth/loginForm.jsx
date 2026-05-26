import { useState } from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import { publicLoginControls } from "../../../services/utils/config";
import Input from "../../ui/Input";
import { Link } from "react-router";

const LoginForm = () => {
  const [formData, setFormData] = useState({});

  return (
    <form className="min-w-100">
      {publicLoginControls.map((control) => (
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
        Log in
      </PrimaryButton>
    </form>
  );
};
export default LoginForm;
