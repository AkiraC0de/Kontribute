import Joi from "joi";

export const createProjectSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(256)
    .required()
    .messages({
      "string.empty": "Project title is required.",
      "string.max": "Project title cannot exceed 256 characters.",
      "any.required": "Title is a required field."
    }),

  description: Joi.string()
    .trim()
    .max(512)
    .allow("", null), 

  subject: Joi.string()
    .trim()
    .max(256)
    .allow("", null),

  deadline: Joi.date() 
    .greater("now") // Ensures the deadline is in the future
    .required()
    .messages({
      "date.base": "A valid deadline date is required.",
      "date.greater": "The deadline must be a future date.",
      "any.required": "Deadline is a required field."
    }),

  settings: Joi.object({
    allowMembersToInvite: Joi.boolean().default(false),
    maxMembers: Joi.number()
      .integer()
      .min(2)
      .max(50)
      .default(8)
  }).default() // .default() here ensures it defaults to {} if entirely missing from req.body
});