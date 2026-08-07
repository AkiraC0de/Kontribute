import express from "express"
import initDatabase from "./db/connect"

const app = express()

app.listen(process.env.PORT, async () => {
  await initDatabase()
  console.log("Startup success. Api 2.0 is now running on port:", process.env.PORT)
})