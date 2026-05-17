import { createProject, getMyProjects } from "./project.services.js"

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