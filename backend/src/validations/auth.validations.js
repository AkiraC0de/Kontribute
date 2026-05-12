import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      "string.empty": "First name is required.",
      "any.required": "First name is a required field."
    }),

  lastName: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      "string.empty": "Last name is required.",
      "any.required": "Last name is a required field."
    }),

  middleInitial: Joi.string()
    .trim()
    .max(3) 
    .optional()
    .allow("", null),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is a required field."
    }),

  password: Joi.string()
    .trim()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      "string.empty": "Password is required.",
      "any.required": "Password is a required field."
    }),

  passwordConfirm: Joi.string()
    .trim()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Passwords do not match.",
      "any.required": "Please confirm your password."
    }),
  agreedToTerms: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      "boolean.base": "Agreement with terms and conditions must be a boolean value.",
      "any.only": "You must accept the terms and conditions to proceed.",
      "any.required": "Agreement with terms and conditions is required."
    }),
});