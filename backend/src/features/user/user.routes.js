import { Router } from "express";
import { handleMe } from "./user.controllers";
import verifyAuth from "../../middlewares/verifyAuth";

const userRoute = Router();


// GET /api/v1/user/me - Fetch users data
userRoute.get("/me", verifyAuth, handleMe)

export default userRoute;