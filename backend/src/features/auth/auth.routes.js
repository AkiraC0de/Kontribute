import { Router } from "express";

const authRoute = Router();

authRoute.post("/register", (req, res) => {
  res.status(200).json({"test": "test2"});
});

export default authRoute