import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/ErrorHandler.js";

import authRoute from "./src/features/auth/auth.routes.js";

const app = express();

// Middlewares
app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/api/v1/auth', authRoute);

app.listen(process.env.PORT, () => {
    console.log(`The Server is running at PORT ${process.env.PORT}`);
})