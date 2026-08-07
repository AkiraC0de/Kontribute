import { Router } from "express"
import { register } from "../controllers/auth.controllers"

const authRoute = Router()

authRoute.post("/register", register)

export default authRoute