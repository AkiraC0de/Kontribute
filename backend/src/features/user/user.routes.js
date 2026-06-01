import { Router } from "express";
import { handleMe } from "./user.controllers.js";
import verifyAuth from "../../middlewares/verifyAuth.js";

const userRoute = Router();


// GET /api/v1/user/me - Fetch users data
userRoute.get("/me", verifyAuth, handleMe)

export default userRoute;