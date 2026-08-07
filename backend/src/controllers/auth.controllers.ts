import { Response, Request } from "express";

import { validateData } from "../utils/validatorUtils";
import { registerSchema } from "../validations/auth.validations";

import { registerUser } from "../services/auth.services";
import { SuccessResponse } from "../core/ApiResponse";

export async function register(req: Request, res: Response){
  const userData = validateData<typeof registerSchema>(registerSchema, req.body) 

  const result = await registerUser(userData)

  return new SuccessResponse(result.message, result.data).send(res)
}