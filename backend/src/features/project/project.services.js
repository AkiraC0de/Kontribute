import ERROR_CODES from "../../config/errorCodes.js";
import GenericError from "../../errors/GenericError.js";
import InvitationNotFound from "../../errors/InvitationNotFound.js";
import ProjectNotFound from "../../errors/ProjectNotFound.js";
import Invitation from "../../models/invitation.model.js";
import Project from "../../models/project.model.js"
import { generateCryptoToken } from "../../utils/utils.js";

export const createProject = async (userId, projectData) => {
  const { title, description, subject, deadline, settings } = projectData;

  const maxAmountProjects = 20;
  const activeProjectsCount = await Project.countDocuments({ 
    leader: userId,  
    status: "active"
  }).limit(maxAmountProjects);

  if(activeProjectsCount >= maxAmountProjects){
    throw new GenericError(400, "You have reached the maximum amount of allowed 20 Projects. You may finish or delete inactive projects.", ERROR_CODES.TOO_MANY_REQUEST);
  }
  
  const uniqueShareToken = generateCryptoToken();

  const newProject = await Project.create({
    title,
    description,
    subject,
    deadline: new Date(deadline),
    leader: userId,
    createdBy: userId,
    shareToken: uniqueShareToken,
    settings,
    
    // Automatically add the creator as the first member with the "leader" role
    members: [
      {
        userId: userId,
        role: "leader",
      }
    ]
  });

  return {
    message: "Your Project has been created.",
    project: newProject.toPublicJSON()
  }
}


export const getMyProjects = async (userId, statusFilter) => {
  const query = {
    $or: [
      { leader: userId },
      { members: { $elemMatch: { userId: userId, status: "active" } } } // Updated to use $elemMatch as discussed earlier
    ]
  };

  if (statusFilter) {
    // If they ask for "active" or "completed", give them exactly that
    query.status = statusFilter;
  } else {
    // If status is null/undefined, fetch everything EXCEPT "archived"
    query.status = { $ne: "archived" };
  }

  const projects = await fetchProjects(query);

  return {
    message: projects.length ? "These are your projects." : "No projects were found.",
    projectsCount: projects.length,
    projects: projects.map((p) => p.toPublicJSON()),
  };
};

// -- invitation services

export const inviteMember = async (projectId, invitedBy, inviting) => {
  const conflictInvitation = await Invitation.findOne({projectId, inviting, status: "pending"});
  if(conflictInvitation){
    throw new GenericError(400, "User already invited.", ERROR_CODES.REQUEST_ERROR);
  }

  return Invitation.create({
    projectId,
    invitedBy,
    inviting,
    status: "pending"
  })    
}

export const getMyInvitaions = async (userId, statusFilter = "pending") => {
  const invitations = await Invitation.find({inviting: userId, status: statusFilter})
  .sort({ expiresAt: 1 })
  .populate("invitedBy", "firstName lastName username")
  .populate("projectId", "title description");

  const invitationsCount = invitations.length;

  if(invitationsCount == 0){
    return {
      message: `No ${statusFilter} invitation have found.`,
      invitationsCount,
      invitations : []
    }
  }

  const sanitizedInvitations = invitations.map(i => i.toPublicJSON()) 
  
  return {
    message: "These are your pending invitations.",
    invitationsCount,
    invitations : sanitizedInvitations
  }
}

export const respondToMyInvitation = async (invitation, response) => {
  if(response === "accept"){
    await handleAcceptedInvitation(invitation)
  } else if(response === "reject"){
    await handleRejectedInvitation(invitation);
  } 

  const responseMessage = response === "accept" 
                            ? "You have accepted the invitation. You are now part of the project."
                            : "You have rejected the invitation."
  return {
    message: responseMessage
  }
}

export const updateProjectStatus = async (project, status) => {
  // check if the current status is same as the new status
  if(project.status === status){
    throw new GenericError(400, "Current status of the project is same as you want to change into.", ERROR_CODES.REQUEST_ERROR);
  }

  project.status = status;
  return project.save() 
}

export const getMyLedProjects = async (userId, statusFilter) => {
  const query = { leader: userId };

  if (statusFilter) {
    // If they ask for "active" or "completed", give them exactly that
    query.status = statusFilter;
  } else {
    // If status is null/undefined, fetch everything EXCEPT "archived"
    query.status = { $ne: "archived" };
  }

  const projects = await fetchProjects(query);

  return {
    message: projects.length ? "These are your projects led by you." : "No projects led by you were found.",
    projectsCount: projects.length,
    projects: projects.map((p) => p.toPublicJSON()),
  };
}

// -- helpers

const fetchProjects = (query) =>
  Project.find(query)
    .sort({ deadline: 1 })
    .populate("leader", "firstname lastname username");

const handleRejectedInvitation = async (invitation) => {
  return invitation.changeStatus("rejected").save();
}

const handleAcceptedInvitation = async (invitation) => {
  // add the user to projects member
  const project = await findActiveProjectById(invitation.projectId);
  await project.addMember(invitation.inviting).save();

  // set the invitation as accepted
  await invitation.changeStatus("accepted").save()
}


export const findActiveProjectById = async (projectId) => {
  const project = await Project.findOne({status: "active", _id: projectId});

  if(!project){
    throw new ProjectNotFound();
  }
  
  return project;
}

export const findPendingInvitationById = async (invitationId) => {
  const invitation = await Invitation.findOne({status: "pending", _id: invitationId});

  if(!invitation){
    throw new InvitationNotFound();
  }

  return invitation;
}
