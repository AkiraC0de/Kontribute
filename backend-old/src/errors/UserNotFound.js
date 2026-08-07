import ERROR_CODES from "../config/errorCodes.js";
import GenericError from "./GenericError.js"

class UserNotFound extends GenericError {
  constructor(){
    super(
      404,
      "User not found.",
      ERROR_CODES.NOT_FOUND,
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

export default UserNotFound;