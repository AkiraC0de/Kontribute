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
  handleUpdateProjectStatus,
  handleGetProject
} from "./project.controllers.js";


const projectRoute = Router();

// -- Project routes

// POST /api/v1/project - Create a brand new project
projectRoute.post("/", 
  verifyAccess(), 
  joiValidator(createProjectSchema), 
  handleCreateProject
);

// GET /api/v1/project - Fetch all projects the user is a part of
projectRoute.get("/", verifyAccess(), handleGetMyProjects);

// GET /api/v1/project/:projectId - Fetch details for a specific project
projectRoute.get("/:projectId", verifyAccess(), handleGetProject);

// POST /api/v1/project/:projectId/leave - Leave from the project route
projectRoute.post("/:projectId/leave", verifyAccess(), handleLeaveProject);

// POST /api/v1/project/:projectId/transfer-leadership/:userId - Transfer leadership of the project
projectRoute.post("/:projectId/transfer-leadership/:userId", verifyAccess(), handleTransferLeadership)

// POST /api/v1/project/:projectId/invite/:userId - Send an invitation to someone to be part of the project.
projectRoute.post("/:projectId/invite/:userId", verifyAccess(), handleInviteMember);

// PATCH /api/v1/project/:projectId/status - Update the projects status (active, completed, archived)
projectRoute.patch("/:projectId/status", 
  verifyAccess(), 
  joiValidator(updateProjectStatusSchema), 
  handleUpdateProjectStatus
)

// -- project invitation routes

// GET /api/v1/project/invitation - Fetch users pending project invitations
projectRoute.get("/invitation", verifyAccess(), handleGetMyInvitations);

// PUT /api/v1/project/invitation/:invitationId - Users respond to their pending project invitations
projectRoute.put("/invitation/:invitationId", 
  verifyAccess(), 
  joiValidator(respondToMyInvitationSchema), 
  handleRespondToMyInvitation
);

// -- Future implementation (commented out)

// GET /api/v1/project/leader - Fetch all projects where the user is the leader
// projectRoute.get("/leader", verifyAccess());



// PUT /api/v1/project/:projectId - Update projects data
// projectRoute.put("/:projectId")

// DELETE /api/v1/project/:projectId - Permanently delete a project
// projectRoute.delete("/:projectId", verifyAccess());

// -- Project member routes

// GET /api/v1/project/:projectId/member - Fetch the project members
// projectRoute.get("/:projectId/member". verifyAccess(),  );

// DELETE /api/v1/project/:projectId/member/:userId - Remove a member from the group ONLY for LEADER
// projectRoute.delete("/:projectId/member/:userId". verifyAccess());

export default projectRoute;