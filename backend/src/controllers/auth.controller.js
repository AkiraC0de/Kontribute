import { registerUser } from "../services/auth.services.js"

export const handleRegister = async (req, res) => {
  const result = await registerUser(req.body);
}
