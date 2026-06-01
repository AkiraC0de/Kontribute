import Joi from "joi";

export const accountSetUpSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      "string.empty": "First name is required",
      "any.required": "First name is required"
    }),

  lastName: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      "string.empty": "Last name is required",
      "any.required": "Last name is required"
    }),

  middleInitial: Joi.string()
    .trim()
    .length(1)
    .pattern(/^[a-zA-Z]$/)  
    .uppercase()
    .optional()
    .messages({
      "string.length": "Middle initial must be exactly one letter",
      "string.pattern.base": "Middle initial must be a letter"
    }),

  username: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.alphanum": "Username can only contain alphanumeric characters",
      "string.min": "Username must be at least 3 characters long",
      "any.required": "Username is required"
    })
});