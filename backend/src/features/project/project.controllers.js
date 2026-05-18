import GenericError from "../../errors/GenericError.js";
import UnauthorizeError from "../../errors/UnauthorizeError.js";
import Project from "../../models/project.model.js";
import ERROR_CODES from "../../config/errorCodes.js";

import { findUserById } from "../auth/auth.services.js";

import { 
  createProject, 
  findActiveProjectById, 
  getMyInvitaions, 
  getMyProjects, 
  inviteMember 
} from "./project.services.js";

export const handleCreateProject = async (req, res) => {
  const result = await createProject(req.user._id, req.body);

  return res.status(200)
    .json({
      success : true,
      message: result.message,
      project: result.project
    });
}

export const handleGetMyProjects = async (req, res) => {
  const statusFilter = req.query.status ||  "active";
  const result = await getMyProjects(req.user._id, statusFilter);

  return res.status(200)
    .json({
      success : true,
      message: result.message,
      projectsCount: result.projectsCount,
      projects: result.projects
    });
}


// -- invitation controllers
export const handleInviteMember = async (req, res) => {
  const invitedByUserId = req.user._id;
  const invitingUserId = req.params.userId;

  if(invitedByUserId === invitingUserId){
    throw new GenericError(400, "You cannot invite youself", ERROR_CODES.REQUEST_ERROR);
  }

  const project = await findActiveProjectById(req.params.projectId);

  // verify if the invitedByUser is a member of this project
  if(!project.isMember(invitedByUserId)){
    throw new UnauthorizeError("You are not a member of this project.")
  }

  // verify if the project allowed the members to sent an invitation.
  const isLeader = project.leader.equals(invitedByUserId);
  const isMemberAllowedToInvite = project.settings.allowMembersToInvite;
  if(!isMemberAllowedToInvite && !isLeader){
    throw new UnauthorizeError("Only leader is allowed to invite new member.")
  }
  
  // check if the user is already a member
  if(project.isMember(invitingUserId)){
    throw new GenericError(400, "User is already a member of this project.", ERROR_CODES.REQUEST_ERROR);
  }

  const invitingUser = await findUserById(invitingUserId);
  const invitation = await inviteMember(project._id, invitedByUserId, invitingUser._id);

  const responseMessage = `Project invitation has been sent to @${invitingUser.username}.`

  return res.status(200).json({
    success: true,
    message: responseMessage
  })
}

export const handleGetMyInvitations = async (req, res) => {
  const statusFilter = req.query.status || "pending";
  const result = await getMyInvitaions(req.user._id, statusFilter);

  return res.status(200).json({
    success: true,
    message: result.message,
    invitationsCount : result.invitationsCount,
    invitations : result.invitations
  })
}