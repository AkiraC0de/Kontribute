import React, { useState } from "react";

const PasswordInput = ({ label, id, error, className = "", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`text-sm flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="font-medium text-gray-700 tracking-wide">
          {label}
        </label>
      )}

      <div className="relative rounded-md shadow-sm">
        <input
          id={id}
          {...props}
          type={showPassword ? "text" : "password"}
          className={`
            block w-full rounded-lg border px-4 py-2.5 text-gray-900 
            placeholder-gray-400 transition-colors duration-200
            focus:outline-none focus:ring-2
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
            }
          `}
        />

        <button
          type="button"
          tabIndex="-1"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-0.5">{error}</p>}
    </div>
  );
};

const CheckboxRadioInput = ({ label, id, type, error, className = "", ...props }) => {
  return (
    <div className={`text-sm flex flex-col gap-1${className}`}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type={type}
          className={`
            h-4 w-4 text-indigo-600 border-gray-300 transition-colors
            focus:ring-2 focus:ring-indigo-500
            disabled:cursor-not-allowed disabled:bg-gray-100
            ${type === "radio" ? "rounded-full" : "rounded"}
            ${error ? "border-red-300 focus:ring-red-200" : ""}
          `}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-600 mt-0.5">{error}</p>}
    </div>
  );
};

const StandardInput = ({ label, id, type, error, className = "", ...props }) => {
  return (
    <div className={` text-sm flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="font-medium text-gray-700 tracking-wide">
          {label}
        </label>
      )}

      <div className="relative rounded-md shadow-sm">
        <input
          id={id}
          {...props}
          type={type}
          className={`
            block w-full rounded-lg border px-4 py-2.5 text-gray-900 
            placeholder-gray-400 transition-colors duration-200
            focus:outline-none focus:ring-2
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${type === "date" ? "min-h-[46px]" : ""}
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
            }
          `}
          
        />
      </div>

      {error && <p className="text-sm text-red-600 mt-0.5">{error}</p>}
    </div>
  );
};

const Input = ({ type = "text", ...props }) => {
  switch (type) {
    case "password":
      return <PasswordInput type={type} {...props} />;
      
    case "checkbox":
    case "radio":
      return <CheckboxRadioInput type={type} {...props} />;
      
    // Text, email, number, date, tel, url, etc. 
    default:
      return <StandardInput type={type} {...props} />;
  }
};

export default Input;