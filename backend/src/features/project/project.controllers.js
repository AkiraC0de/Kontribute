import Project from "../../models/project.model.js";
import { findUserById } from "../auth/auth.services.js";
import { createProject, findProjectById, getMyProjects } from "./project.services.js";

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


// -- invite controllers
export const handleInviteMember = async (req, res) => {
  const invitedByUserId = req.user._id;

  const project = await findProjectById(req.params.projectId);
  const invitingUser = await findUserById(req.params.userId);

  await project.inviteMember(invitingUser.username, invitedByUserId).save();

  return res.status(200).json({
    success: true,
    message: "invited " + invitingUser._id
  })
}