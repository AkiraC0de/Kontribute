import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./src/features/auth/auth.routes.js";

const app = express();

// Middlewares
app.use(cors())
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);

app.listen(process.env.PORT, () => {
    console.log(`The Server is running at PORT ${process.env.PORT}`);
})