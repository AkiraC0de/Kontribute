import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import initDatabase from "./db/connect"
import errorHandler from "./middlewares/errorHandler"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))


app.use(errorHandler())

app.listen(process.env.PORT, async () => {
  await initDatabase()
  console.log("Startup success. Api 2.0 is now running on port:", process.env.PORT)
})