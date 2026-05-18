import ERROR_CODES from "../../config/errorCodes.js";
import GenericError from "../../errors/GenericError.js";
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
    throw GenericError(400, "You have reached the maximum amount of allowed 20 Projects. You may finish or delete inactive projects.", ERROR_CODES.TOO_MANY_REQUEST);
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
  const projects = await Project.find({
    status: statusFilter,
    $or: [
      { leader: userId },
      { "members.userId": userId }
    ]
  })
  .sort({ deadline: 1 })
  .populate("leader", "name email");

  const projectsCount = projects.length;

  if(projectsCount == 0){
    throw new GenericError(404, "No projects found.", ERROR_CODES.NOT_FOUND);
  }

  const sanitizedProjects = projects.map(p => p.toPublicJSON()) 

  return {
    message: "These are your projects.",
    projectsCount,
    projects : sanitizedProjects
  }
} 


export const inviteMember = async (projectId, invitedBy, inviting) => {
  const conflictInvitation = await Invitation.findOne({projectId, inviting});
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

// -- helpers
export const findActiveProjectById = async (projectId) => {
  const project = await Project.findOne({status: "active", _id: projectId});
  if(!project) {
    throw new ProjectNotFound();
  }

  return project;
}