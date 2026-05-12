import { registerUser } from "../services/auth.services.js"

export const handleRegister = async (req, res) => {
  const result = await registerUser(req.body);

  return res.status(200)
    .json({
      success: true,
      message: "Account has successfully created.",
      data: result
    });
}
