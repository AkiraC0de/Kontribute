import ERROR_CODES from "../../config/errorCodes.js";
import GenericError from "../../errors/GenericError.js";
import Project from "../../models/project.model.js"
import { generateCryptoToken } from "../../utils/utils.js";

export const createProject = async (userId, projectData) => {
  const { title, description, subject, deadline, settings } = projectData;

  const maxAmountProjects = 20;
  const activeProjectsCount = await Project.countDocuments({ createdBy: userId,  status: "active"});
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

