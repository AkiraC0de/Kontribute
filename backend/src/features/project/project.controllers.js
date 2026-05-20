import GenericError from "../../errors/GenericError.js";
import UnauthorizeError from "../../errors/UnauthorizeError.js";
import Project, { PROJECT_STATUS } from "../../models/project.model.js";
import ERROR_CODES from "../../config/errorCodes.js";

import { 
  createProject, 
  fetchInvitaionsByStatus, 
  fetchUserProjects, 
  inviteMember ,
  findPendingInvitationById,
  respondToMyInvitation,
  updateProjectStatus,
  fetchUserLedProjects,
  validateQueryProjectStatus,
  fetchProjectMembers,
  findProjectByStatus,
  switchMemberRole,
  validateQueryInvitationStatus
} from "./project.services.js";

import InvitationNotFound from "../../errors/InvitationNotFound.js";
import ProjectNotFound from "../../errors/ProjectNotFound.js";
import Member, { MEMBER_ROLES, MEMBER_STATUS } from "../../models/member.model.js";

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


export const handleGetInvitations = async (req, res) => {
  validateQueryInvitationStatus(req.query.status)
  const invitations = await fetchInvitaionsByStatus(req.user._id, req.query.status);

  return res.status(200).json({
    success: true,
    message: invitations.length ? "These are your invitations." : "No invitation have found.",
    data: {
      invitationsCount : invitations.length,
      invitations : invitations.map(i => i.toPublicJSON())
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

export const handleTransferLeadership = async (req, res) => {
  const currentLeader = req.projectMembership;
  const targetMember = await Member.findById(req.params.userId);

  if(!targetMember.projectId.equals(req.params.projectId))
    throw new GenericError(400, "Target member is not part of the project.", ERROR_CODES.REQUEST_ERROR);

  switchMemberRole(currentLeader, targetMember);

  res.status(200)
    .json({
      success: true,
      message: "You have successfully transfer the leadership. You are now a member.",
      data: {
        project: {
          ...project.toPublicJSON(),
          myRole: currentLeader.role,
          joinedAt: currentLeader.joinedAt
        }
      }
    })
}

export const handleUpdateProjectStatus = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  // check if the project was already archived
  if(project.status === PROJECT_STATUS.ARCHIVED)
    throw new ProjectNotFound();

  const newStatus = req.body.status;
  await updateProjectStatus(project, newStatus);

  return res.status(200)
    .json({
      success: true,
      message: `The project status has been changed to ${newStatus}`,
      data: {
        project: project.toPublicJSON()
      }
    })
}

export const handleInviteMember = async (req, res) => {
  const invitedByUserId = req.user._id;
  const invitingUserId = req.params.userId;
  const projectId = req.params.projectId;

  if(invitedByUserId === invitingUserId) 
    throw new GenericError(400, "You cannot invite youself", ERROR_CODES.REQUEST_ERROR);

  const project = await findProjectByStatus(projectId, PROJECT_STATUS.ACTIVE);

  // verify if the project allowed the members to sent an invitation.
  const isLeader = req.projectMembership.role === MEMBER_ROLES.LEADER;
  const isMemberAllowedToInvite = project.settings.allowMembersToInvite;

  if(!isMemberAllowedToInvite && !isLeader) 
    throw new UnauthorizeError("Project is set to only allowed the leader to invite a member.")

  const isInvitingAlreadyMember = await Member.findOne({projectId, userId: invitingUserId, status : MEMBER_STATUS.ACTIVE});
  if(isInvitingAlreadyMember)
    throw new GenericError(400, "The you user you want to invite is already a member.", ERROR_CODES.REQUEST_ERROR);

  await inviteMember(project._id, invitedByUserId, invitingUserId);

  return res.status(200).json({
    success: true,
    message: "Project invitation has been sent"
  })
}

export const handleKickMember = async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  // check if the project was already deleted
  if(project.status === "archived"){
    throw new ProjectNotFound();
  }

  const userId = req.user._id;
  const kickUserId = req.params.userId;

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
