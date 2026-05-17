import { createProject } from "./project.services.js"

export const handleCreateProject = async (req, res) => {
  const result = await createProject(req.user._id, req.body);

  return res.status(200)
    .json({
      success : true,
      message: result.message,
      project: result.project
    });
}