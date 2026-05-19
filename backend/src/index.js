import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/ErrorHandler.js";

import authRoute from "./features/auth/auth.routes.js";
import projectRoute from "./features/project/project.routes.js";
import notificationRoute from "./features/notification/notification.routes.js";
import connectToDB from "./config/database.js";

const app = express();

// Middlewares
app.use(cors())
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/notification", notificationRoute);

// Error handler
app.use(errorHandler);

app.listen(process.env.PORT, async () => {
    try {
        await connectToDB();
        console.log(`The Server is running at PORT ${process.env.PORT}`);
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
})