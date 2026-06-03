import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import PrimaryButton from "../../../ui/PrimaryButton";
import Input from "../../../ui/Input";
import Spinner from "../../../common/Spinner"
import useSnackbarNotification from "../../../../services/snackbar-notification/hooks/useSnackbarNotification"

import { formatValidationErrors, isValidEmail, isValidString } from "../../../../services/utils/utils";
import { publicLoginControls } from "../../../../services/utils/config";
import authService from "../../../../services/api/authService";
import { loginUser } from "../../../../services/store/authSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useSnackbarNotification()

  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    publicLoginControls.forEach((control) => {
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

    setIsLoading(true);
    try {  
      const data = await authService.login(formData);
      dispatch(loginUser(data.user));
      showNotification("Login Successfull", "SUCCESS");
      navigate(location.state?.from || "/main/dashboard", { replace: true });
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
    <form onSubmit={handleSubmit}>
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
          error={fieldErrors[control.name]}
        />
      ))}
      <div className="mt-4 text-end text-sm">
        <Link to="/auth/forgot-password" state={{identifier: formData?.identifier || ""}} className="hover:underline">Forgot password</Link>
      </div>
      {globalError && <p className="text-red-500 text-sm text-center my-4">{globalError}</p>}
      <PrimaryButton disabled={isLoading} className="w-full mt-5 flex justify-center items-center" type="submit">
        {isLoading ? <Spinner color="bg-white"/> : "Log in"}
      </PrimaryButton>
    </form>
  );
};
export default LoginForm;
