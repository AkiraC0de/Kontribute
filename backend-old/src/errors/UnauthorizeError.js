import GenericError from "./GenericError.js";
import ERROR_CODES from "../config/errorCodes.js";

class UnauthorizeError extends GenericError {
  constructor(message, code = ERROR_CODES.UNUTHORIZE_ERROR) {
    super(
      401,
      message,
      code,
    );
  }

  toJSON() {
      return {
          success: false,
          code: this.code,  
          message: this.message
      };
  }
}

export default UnauthorizeError;