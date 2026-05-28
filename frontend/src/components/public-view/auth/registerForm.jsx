import { useState } from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import {
  publicLoginControls,
  publicRegisterControls,
} from "../../../services/utils/config";
import Input from "../../ui/Input";
import { Link } from "react-router";
import authService from "../../../services/api/authService";
import {
  formatValidationErrors,
  isValidEmail,
  isValidString,
} from "../../../services/utils/utils";
import Spinner from "../../common/Spinner"

const RegisterForm = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!isValidEmail(formData?.email)) {
      errors.email = "Invalid email format.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Password did not match.";
    }
    publicRegisterControls.forEach((control) => {
      if (control.required && !isValidString(formData[control.name])) {
        errors[control.name] = `${control.label} is required.`;
      }
    });

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    const isFormValid = validateForm();
    if (!isFormValid) return;
    if (!formData.agreedToTerms){
      return setFieldErrors(prev => ({...prev, agreedToTerms: "Please agree to the Terms and Conditions to continue."}))
    }
    setIsLoading(true);
    try {
      const user = await authService.register(formData);
    } catch (error) {
      if(error.errors){
        const structuredErrors = formatValidationErrors(error.errors);
        setFieldErrors(structuredErrors);
      } else {
        setGlobalError(error.message)
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
    setGlobalError("");
  };

  const handleAgreeOnChange = (e) => {
    setFormData(prev => ({...prev, agreedToTerms: e.target.checked}))
    setFieldErrors((prev) => ({
      ...prev,
      agreedToTerms: "",
    }));
  }
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
          disabled={isLoading}
          placeholder={control.placeholder}
          onChange={handleOnChange}
          error={fieldErrors[control.name]}
        />
      ))}
      <div className="my-5 text-end">
        <Link to="auth/forgot-password">Forgot password?</Link>
      </div>
      <div className="flex items-center gap-2 ">
        <input 
          type="checkbox" 
          className="w-5 h-5 accent-secondary"
          onChange={handleAgreeOnChange}
        />
        <p>
          I agree to the{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
      {fieldErrors.agreedToTerms && <p className="text-sm text-red-600 mt-0.5">{fieldErrors.agreedToTerms}</p>}
      {globalError && <p className="text-red-500 text-center my-4">{globalError}</p>}
      <PrimaryButton disabled={isLoading} className="w-full mt-5 h-13 flex justify-center items-center" type="submit">
        {isLoading ? <Spinner color="bg-white"/> : "Create account"}
      </PrimaryButton>
    </form>
  );
};
export default RegisterForm;
