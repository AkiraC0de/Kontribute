import { Router } from "express";
import { handleCreateProject } from "./project.controllers.js";
import verifyAccess from "../../middlewares/verifyAccess.js";

const projectRoute = Router();

projectRoute.post("/", verifyAccess(), handleCreateProject);

export default projectRoute;