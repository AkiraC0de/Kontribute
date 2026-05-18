import { Router } from "express";

import verifyAccess from "../../middlewares/verifyAccess.js";
import joiValidator from "../../middlewares/joiValidator.js"

import { 
  createProjectSchema,
  respondToMyInvitationSchema,
  updateProjectStatusSchema
} from "./project.validation.js";
import { 
  handleGetMyInvitations,
  handleCreateProject,
  handleGetMyProjects,
  handleInviteMember,
  handleRespondToMyInvitation,
  handleLeaveProject,
  handleTransferLeadership,
  handleUpdateProjectStatus
} from "./project.controllers.js";


const projectRoute = Router();

// -- Project routes

// Create a brand new project
projectRoute.post("/", verifyAccess(), joiValidator(createProjectSchema), handleCreateProject);

// Fetch all projects the user is a part of
projectRoute.get("/", verifyAccess(), handleGetMyProjects);

// leave from the project route
projectRoute.post("/:projectId/leave", verifyAccess(), handleLeaveProject);

// transfer leadership of the project
projectRoute.post("/:projectId/transfer-leadership/:userId", verifyAccess(), handleTransferLeadership)

// Send an invitation to someone to be part of the project.
projectRoute.post("/:projectId/invite/:userId", verifyAccess(), handleInviteMember);

// Update the projects status (active, completed, archived)
projectRoute.patch("/:projectId/status", 
  verifyAccess(), 
  joiValidator(updateProjectStatusSchema), 
  handleUpdateProjectStatus
)

// Fetch all projects where the user is the leader
//projectRoute.get("/leader", verifyAccess());

// Fetch details for a specific project
//projectRoute.get("/:projectId", verifyAccess());

// Update projects data
//projectRoute.put("/:projectId")


// Permanently delete a project
// projectRoute.delete("/:projectId", verifyAccess());



// -- project invitation routes

// fetch users pending project invitations
projectRoute.get("/invitation", verifyAccess(), handleGetMyInvitations);

// Users respond to their pending project invitations
projectRoute.put("/invitation/:invitationId", 
  verifyAccess(), 
  joiValidator(respondToMyInvitationSchema), 
  handleRespondToMyInvitation
);




// -- Project member routes

// fetch the project members
// projectRoute.get("/:projectId/member". verifyAccess(),  );

// // add Member route
// projectRoute.post("/:projectId/member/:userId". verifyAccess());


// // remove a member from the group ONLY for LEADER
// projectRoute.delete("/:projectId/member/:userId". verifyAccess());

export default projectRoute;