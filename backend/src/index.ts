import express from "express"

const app = express()

app.listen(process.env.PORT, () => {
  console.log("Startup success. Api 2.0 is now running on port:", process.env.PORT)
})