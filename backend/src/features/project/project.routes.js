import { Router } from "express";
import { handleCreateProject } from "./project.controllers.js";

const projectRoute = Router();

projectRoute.post("/", handleCreateProject);

export default projectRoute;