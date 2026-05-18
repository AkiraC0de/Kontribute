import { Router } from "express";

import verifyAccess from "../../middlewares/verifyAccess.js";
import joiValidator from "../../middlewares/joiValidator.js"

import { 
  createProjectSchema
} from "./project.validation.js";
import { 
  handleGetMyInvitations,
  handleCreateProject,
  handleGetMyProjects,
  handleInviteMember
} from "./project.controllers.js";


const projectRoute = Router();

// -- Project routes

// Create a brand new project
projectRoute.post("/", verifyAccess(), joiValidator(createProjectSchema), handleCreateProject);

// Fetch all projects the user is a part of
projectRoute.get("/", verifyAccess(), handleGetMyProjects);

// Fetch all projects where the user is the leader
//projectRoute.get("/leader", verifyAccess());

// Fetch details for a specific project
//projectRoute.get("/:projectId", verifyAccess());

// Update projects data
//projectRoute.put("/:projectId")

// Update the projects status (active, completed, archived)
//projectRoute.patch("/:projectId/status")

// Permanently delete a project
// projectRoute.delete("/:projectId", verifyAccess());




// -- project invitation routes

// Send an invitation to someone to be part of the project.
projectRoute.post("/:projectId/invite/:userId", verifyAccess(), handleInviteMember);

// fetch users pending project invitations
projectRoute.get("/invitation", verifyAccess(), handleGetMyInvitations);

// Users resonse to their pending project invitations
projectRoute.put("/invitation/:invitationId", verifyAccess(), handleGetMyInvitations);




// -- Project member routes

// fetch the project members
// projectRoute.get("/:projectId/member". verifyAccess(),  );

// // add Member route
// projectRoute.post("/:projectId/member/:userId". verifyAccess());

// // leave from the project route
// projectRoute.post("/:projectId/leave/:userId". verifyAccess());

// // remove a member from the group ONLY for LEADER
// projectRoute.delete("/:projectId/member/:userId". verifyAccess());

export default projectRoute;