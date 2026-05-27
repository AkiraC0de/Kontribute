import { useState } from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import { publicLoginControls, publicRegisterControls } from "../../../services/utils/config";
import Input from "../../ui/Input";
import { Link } from "react-router";
import authService from "../../../services/api/authService";
import { formatValidationErrors, isValidEmail, isValidString } from "../../../services/utils/utils";

const RegisterForm = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  
  const validateForm = () => {
    const errors = {};
    if(!isValidEmail(formData?.email)){
      errors.email = "Invalid email format."
    }
    if(formData.password !== formData.confirmPassword){
      errors.confirmPassword = "Password did not match."
    }
    publicRegisterControls.forEach((control) => {
      if (control.required && !isValidString(formData[control.name])) {
        errors[control.name] = `${control.label} is required.`;
      }
    });

    setFieldErrors(errors);
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    setGlobalError("");
    const isFormValid = validateForm();
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const user = await authService.register(formData);
    } catch (error) {
      const structuredErrors = formatValidationErrors(error.errors);
      setFieldErrors(structuredErrors);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFieldErrors(prev => ({
      ...prev,
      [e.target.name] : ""
    }))
    setGlobalError("")
  };

  return (
    <form className="min-w-100" onSubmit={handleSubmit}>
      {publicRegisterControls.map((control) => (
        <Input
          key={control.label}
          id={control.label}
          className="mt-5"
          label={control.label}
          type={control.type}
          name={control.name}
          placeholder={control.placeholder}
          onChange={handleOnChange}
          error={fieldErrors[control.name]}
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
