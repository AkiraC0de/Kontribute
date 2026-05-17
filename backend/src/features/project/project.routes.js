import { Router } from "express";

import verifyAccess from "../../middlewares/verifyAccess.js";
import joiValidator from "../../middlewares/joiValidator.js"

import { 
  createProjectSchema
} from "./project.validation.js";
import { 

  handleCreateProject
} from "./project.controllers.js";


const projectRoute = Router();

projectRoute.post("/", verifyAccess(), joiValidator(createProjectSchema), handleCreateProject);

export default projectRoute;