import { Router } from "express";

import verifyAuth from "../../middlewares/verifyAuth.js";
import joiValidator from "../../middlewares/joiValidator.js"

import { 
  createProjectSchema,
  respondToMyInvitationSchema,
  updateProjectStatusSchema
} from "./project.validation.js";
import { 
  handleGetInvitations,
  handleCreateProject,
  handleGetUserProjects,
  handleInviteMember,
  handleRespondToInvitation,
  handleLeaveProject,
  handleTransferLeadership,
  handleUpdateProjectStatus,
  handleGetProject,
  handleGetUserLedProjects,
  handleKickMember
} from "./project.controllers.js";
import verifyProjectAccess from "../../middlewares/verifyProjectAccess.js";
import { PROJECT_ACTIONS } from "../../models/project.model.js";


const projectRoute = Router();

// -- Project routes

// POST /api/v1/project - Create a brand new project
projectRoute.post("/", 
  verifyAuth, 
  joiValidator(createProjectSchema), 
  handleCreateProject 
);

// GET /api/v1/project - Fetch all projects the user is a part of 
projectRoute.get("/", verifyAuth, handleGetUserProjects); 

// GET /api/v1/project/leader - Fetch all projects where the user is the leader
projectRoute.get("/leader", verifyAuth, handleGetUserLedProjects); 

// GET /api/v1/project/invitation - Fetch users project invitations
projectRoute.get("/invitation", verifyAuth, handleGetInvitations); 

// NEEDS REFACTORING
// PUT /api/v1/project/invitation/:invitationId - Users respond to their pending project invitations
projectRoute.put("/invitation/:invitationId",  verifyAuth, joiValidator(respondToMyInvitationSchema), handleRespondToInvitation);

// GET /api/v1/project/:projectId - Fetch details for a specific project
projectRoute.get("/:projectId", verifyAuth, verifyProjectAccess(PROJECT_ACTIONS.FETCH_PROJECT), handleGetProject);

// POST /api/v1/project/:projectId/leave - Leave from the project route
projectRoute.post("/:projectId/leave", verifyAuth, verifyProjectAccess(PROJECT_ACTIONS.LEAVE), handleLeaveProject); 

// POST /api/v1/project/:projectId/transfer-leadership/:userId - Transfer leadership of the project
projectRoute.post("/:projectId/transfer-leadership/:userId", verifyAuth, verifyProjectAccess(PROJECT_ACTIONS.TRANSFER_LEADERSHIP), handleTransferLeadership) 


// PATCH /api/v1/project/:projectId/status - Update the projects status (active, completed, archived)
projectRoute.patch("/:projectId/status", verifyAuth, verifyProjectAccess(PROJECT_ACTIONS.UPDATE_PROJECT_STATUS), joiValidator(updateProjectStatusSchema), handleUpdateProjectStatus); // REFACTORING

// POST /api/v1/project/:projectId/invite/:userId - Send an invitation to someone to be part of the project.
projectRoute.post("/:projectId/invite/:userId", verifyAuth, verifyProjectAccess(PROJECT_ACTIONS.INVITE_MEMBER), handleInviteMember); 

// NEEDS REFACTORING
// POST /api/v1/project/:projectId/member/:userId - Remove a member from the group ONLY for LEADER
projectRoute.post("/:projectId/kick/:userId", verifyAuth, verifyProjectAccess(PROJECT_ACTIONS.KICK_MEMBER), handleKickMember); // refactoring

// -- Future implementation (commented out)

// PUT /api/v1/project/:projectId - Update projects data
// projectRoute.put("/:projectId")

// DELETE /api/v1/project/:projectId - Permanently delete a project
// projectRoute.delete("/:projectId", verifyAuth);

// -- Project member routes

// GET /api/v1/project/:projectId/member - Fetch the project members
// projectRoute.get("/:projectId/member". verifyAuth,  );



export default projectRoute;