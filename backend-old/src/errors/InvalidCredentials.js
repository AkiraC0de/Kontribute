import GenericError from "./GenericError.js";
import ERROR_CODES from "../config/errorCodes.js";

class InvalidCredentials extends GenericError {
  constructor(message = "Invalid credentials.") {
    super(400, message, ERROR_CODES.INVALID_CREDENTIALS);

    this.name = 'InvalidCredentials';
  }
}

export default InvalidCredentials;