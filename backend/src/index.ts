import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import initDatabase from "./db/connect"
import errorHandler from "./middlewares/errorHandler"

import authRoute from "./routes/auth.routes"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))

app.use("/api/v2/auth", authRoute)

app.use(errorHandler())

app.listen(process.env.PORT, async () => {
  await initDatabase()
  console.log("Startup success. Api 2.0 is now running on port:", process.env.PORT)
})