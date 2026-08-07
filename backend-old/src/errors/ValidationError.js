import GenericError from "./GenericError.js";
import ERROR_CODES from "../config/errorCodes.js";

class ValidationError extends GenericError {
  constructor(message, errors){
    super(
      400,
      message,
      ERROR_CODES.VALIDATION_ERROR
    )

    this.errors = errors;
  }

  toJSON = () => {
    return {
        success: false,
        code: this.code || ERROR_CODES.UNKOWN_ERROR,  
        message: this.message,
        errors: this.errors
    };
  }
}

export default ValidationError;