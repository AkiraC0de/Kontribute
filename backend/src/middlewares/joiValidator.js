import ERROR_CODES from "../config/errorCodes.js";
import GenericError from "../errors/GenericError.js";
import ValidationError from "../errors/ValidationError.js";
import Joi from "joi";

const { Schema } = Joi; 

const joiValidator = (schema, source = "body") => {
  return (req, res, next) => {
    if(!req[source]){
      throw new GenericError(400, `'${source}' is required in the request.`, ERROR_CODES.REQUEST_ERROR);
    }

    const { error, value } = schema.validate(req[source], { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      // Format the error messages into a clean, readable object or array
      const errorDetails = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message.replace(/['"]/g, '') // Strips annoying quotes from Joi errors
      }));
      
      throw new ValidationError("Request failed validation.", errorDetails);
    }

    // Reassign req[source] to the validated/sanitized value (applies Joi's trim, lowercase, etc.)
    req[source] = value;
    next();
  };
};

export default joiValidator