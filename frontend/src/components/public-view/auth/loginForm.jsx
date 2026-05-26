import { useState } from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import { publicLoginControls } from "../../../services/utils/config";
import Input from "../../ui/Input";
import { Link } from "react-router";
import authService from "../../../services/api/authService";

const LoginForm = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = await authService.login(formData);
      console.log(data);
    } catch (error) {
      console.log("error: ", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    console.log(formData);
  };

  return (
    <form className="min-w-100" onSubmit={handleSubmit}>
      {publicLoginControls.map((control) => (
        <Input
          key={control.label}
          id={control.label}
          name={control.name}
          className="mt-5"
          label={control.label}
          type={control.type}
          placeholder={control.placeholder}
          value={formData[control.name] || ""}
          onChange={handleOnChange}
          disabled={isLoading}
        />
      ))}
      <div className="mt-5 text-end">
        <Link to="auth/forgot-password">Forgot password?</Link>
      </div>
      <PrimaryButton disabled={isLoading} className="w-full mt-5" type="submit">
        {isLoading ? "Logging in..." : "Log in"}
      </PrimaryButton>
    </form>
  );
};
export default LoginForm;
