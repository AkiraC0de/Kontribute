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
  inviteMember ,
  findPendingInvitationById,
  respondToMyInvitation
} from "./project.services.js";
import InvitationNotFound from "../../errors/InvitationNotFound.js";

export const handleCreateProject = async (req, res) => {
  const result = await createProject(req.user._id, req.body);

  return res.status(200)
    .json({
      success : true,
      message: result.message,
      data: {
        project: result.project
      }
    });
}

export const handleGetMyProjects = async (req, res) => {
  const statusFilter = req.query.status ||  "active";
  const result = await getMyProjects(req.user._id, statusFilter);

  return res.status(200)
    .json({
      success : true,
      message: result.message,
      data: {
        projectsCount: result.projectsCount,
        projects: result.projects
      }
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
    data: {
      invitationsCount : result.invitationsCount,
      invitations : result.invitations
    }
  })
}

export const handleRespondToMyInvitation = async (req, res) => {
  const invitation = await findPendingInvitationById(req.params.invitationId);

  // verify if the invitation belongs to the user
  if(!invitation.inviting.equals(req.user._id)){
    throw new InvitationNotFound();
  }

  // process the users response to invitation
  const result = await respondToMyInvitation(invitation, req.body.response);  
  
  return res.status(200)
    .json({
      success: true,
      message: result.message
    })
}

export const handleLeaveProject = async (req, res) => {
  const project = await findActiveProjectById(req.params.projectId);
  const userId = req.user._id;

  // check if the user is a member
  if(!project.isMember(userId)){
    throw new UnauthorizeError("You are not a member of this project.")
  }

  // Avoid leader from leaving. Should transfer first the leadership or archive the project
  const isLeader = project.leader.equals(userId);
  if(isLeader){
    throw new GenericError(400, "You are the leader. You must transfer first the leadership, or finish the project, or delete the project.", ERROR_CODES.REQUEST_ERROR);
  }

  // remove the user as a member of the project.
  await project.removeMember(userId).save();

  return res.status(200)
    .json({
      success: true,
      message: `You have successfully leave the project ${project.title}`
    })
}

export const handleTransferLeadership = async (req, res) => {
  const project = await findActiveProjectById(req.params.projectId);
  
  const transferingFrom = req.user._id;
  const transferingTo = req.params.userId;

  await project.transferLeadership(transferingFrom, transferingTo).save();

  res.status(200)
    .json({
      success: true,
      message: "You have successfully transfer the leadership. You are now a member."
    })
}