import GenericError from "../../errors/GenericError.js";
import Project from "../../models/project.model.js";

import { findUserById } from "../auth/auth.services.js";

import { 
  createProject, 
  findActiveProjectById, 
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

  const project = await findActiveProjectById(req.params.projectId);
  if(!project.isMember(invitedUserId)){
    throw new GenericError(400, "You are not part of this project.", ERROR_CODES.REQUEST_ERROR);
  }
  if(project.isMember(invitingUserId)){
    throw new GenericError(400, "User is already a member of this project.", ERROR_CODES.REQUEST_ERROR);
  }

  const invitingUser = await findUserById(invitingUserId);
  const invitation = await inviteMember(project._id, invitedByUserId, invitingUser._id);

  return res.status(200).json({
    success: true,
    message: "invited " + invitingUser._id
  })
}

export const handleGetMyInvitations = (req, res) => {
  
}