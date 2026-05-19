import GenericError from "../../errors/GenericError.js";
import UnauthorizeError from "../../errors/UnauthorizeError.js";
import Project from "../../models/project.model.js";
import ERROR_CODES from "../../config/errorCodes.js";

import { 
  createProject, 
  findActiveProjectById, 
  getMyInvitaions, 
  fetchUserProjects, 
  inviteMember ,
  findPendingInvitationById,
  respondToMyInvitation,
  updateProjectStatus,
  fetchUserLedProjects,
  validateQueryProjectStatus
} from "./project.services.js";

import InvitationNotFound from "../../errors/InvitationNotFound.js";
import ProjectNotFound from "../../errors/ProjectNotFound.js";

export const handleCreateProject = async (req, res) => {
  const project = await createProject(req.user._id, req.body);

  return res.status(200)
    .json({
      success : true,
      message: "Your Project has been created.",
      data: {
        project: project.toPublicJSON()
      }
    });
}

export const handleGetUserProjects = async (req, res) => {
  validateQueryProjectStatus(req.query.status);

  const projects = await fetchUserProjects(req.user._id, req.query.status);

  return res.status(200)
    .json({
      success : true,
      message: projects.length ? "These are your projects." : "No projects were found.",
      data: {
        projectsCount: projects.length,
        projects
      }
    });
}

export const handleGetUserLedProjects = async (req, res) => {
  validateQueryProjectStatus(req.query.status);

  const projects = await fetchUserLedProjects(req.user._id, req.query.status);

  return res.status(200)
    .json({
      success : true,
      message: projects.length ? "These are your leading projects." : "No leading projects were found.",
      data: {
        projectsCount: projects.length,
        projects
      }
    });
}

export const handleGetProject = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  return res.status(200)
    .json({
      success: true,
      message: "Here is your project detials.",
      data: {
        project: {
          ...project.toPublicJSON(),
          myRole : req.projectMembership.role,
          joinedAt: req.projectMembership.joinedAt
        }
      }
    })
}

export const handleLeaveProject = async (req, res) => {
  await req.projectMembership.deleteOne();

  return res.status(200)
    .json({
      success: true,
      message: "You have successfully left the project"
    })
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
  
  const invitation = await inviteMember(project._id, invitedByUserId, invitingUserId);

  const responseMessage = `Project invitation has been sent.`

  return res.status(200).json({
    success: true,
    message: responseMessage
  })
}

export const handleGetMyInvitations = async (req, res) => {
  const statusFilter = req.query.status || "pending";
  if(!(statusFilter == "pending" || statusFilter == "completed")){
    throw new GenericError(400, "Invalid status of project.")
  }
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

export const handleTransferLeadership = async (req, res) => {
  const project = await findActiveProjectById(req.params.projectId);

  const transferingFrom = req.user._id;
  const transferingTo = req.params.userId;

  await project.transferLeadership(transferingFrom, transferingTo).save();

  res.status(200)
    .json({
      success: true,
      message: "You have successfully transfer the leadership. You are now a member.",
      data: {
        project: project.toPublicJSON()
      }
    })
}

export const handleUpdateProjectStatus = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  // check if the project was already archived
  if(project.status === "archived"){
    throw new ProjectNotFound();
  }

  const userId = req.user._id;
  const status = req.body.status;
  const newStatus = status === "deleted" ? "archived" : status;

  // check if the user is a member
  if(!project.isMember(userId)){
    throw new UnauthorizeError("You are not a member of this project.")
  }

  // check if the user is the leader
  const isLeader = project.leader.equals(userId);
  if(!isLeader){
    throw new UnauthorizeError("Only leader is allowed to update the project status.")
  }

  await updateProjectStatus(project, newStatus);

  return res.status(200)
    .json({
      success: true,
      message: `The project status has been changed to ${status}`,
      data: {
        project: status === "deleted" ? null : project.toPublicJSON()
      }
    })
}


export const handleKickMember = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  const userId = req.user._id;
  const kickUserId = req.params.userId;

  // check if the project was already archived
  if(project.status === "archived"){
    throw new ProjectNotFound();
  }

  if(!project.isMember(userId)){
    throw new UnauthorizeError("You are not a member of this project.")
  }

  // Check if the user is the leader
  const isLeader = project.leader.equals(userId);
  if(!isLeader){
    throw new UnauthorizeError("You are not a the leader of this project to kick someone.")
  }

  if(!project.isMember(kickUserId)){
    throw new UnauthorizeError("User is not a member of this project.")
  }

  // remove the user as a member of the project.
  await project.removeMember(kickUserId).save();

  return res.status(200)
    .json({
      success: true,
      message: "You have successfully kick the member from the project."
    })
} 