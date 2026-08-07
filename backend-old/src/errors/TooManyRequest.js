import GenericError from "./GenericError.js";
import ERROR_CODES from "../config/errorCodes.js";

class TooManyRequest extends GenericError {
  constructor(message = "Please wait.") {
    super(400, message, ERROR_CODES.TOO_MANY_REQUEST);

    this.name = 'TooManyRequest';
  }
}

export default TooManyRequest;