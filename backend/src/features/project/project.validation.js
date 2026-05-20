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

export const respondToMyInvitationSchema = Joi.object({
  response: Joi.string()
    .required()
    .valid("accept", "reject")
    .messages({
      "string.base": "Response must be a valid text string.",
      "any.only": "Response must be either 'accept' or 'reject'.",
      "any.required": "Response is a required field."
    })
});

export const updateProjectStatusSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid("active", "completed", "archived")
    .messages({
      "string.base": "Status must be a valid text string.",
      "any.only": "Status must be either 'active', 'completed', or 'deleted'.",
      "any.required": "Status is a required field."
    })
})

export const updateProjectSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(256)
    .messages({
      "string.empty": "Project title cannot be empty.",
      "string.max": "Project title cannot exceed 256 characters."
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
    .greater("now")
    .messages({
      "date.base": "A valid deadline date is required.",
      "date.greater": "The deadline must be a future date."
    }),

  settings: Joi.object({
    allowMembersToInvite: Joi.boolean(),
    maxMembers: Joi.number()
      .integer()
      .min(2)
      .max(50)
  })
}).min(1).messages({
  "object.min": "At least one field must be provided to update."
})