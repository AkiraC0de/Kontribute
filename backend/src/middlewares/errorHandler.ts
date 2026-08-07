import { NextFunction, Request, Response } from "express"

import ApiError from "../core/ApiError"
import { InternalResponse } from "../core/ApiResponse"

function errorHandler(){
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof ApiError){
      err.handle(err, res)
    } else {
      console.error("Unpexted error happened: ", err.message)
      new InternalResponse("Internal server error.").send(res)
    }
  }
}

export default errorHandler