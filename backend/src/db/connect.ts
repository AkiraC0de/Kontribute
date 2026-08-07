import mongoose from "mongoose"
import dns from "node:dns"

async function initDatabase() {
  try {
      
    if(!process.env.MONGO_URI) throw new Error("'MONGO_URI' is required in .env file to initialized the connection with database.")
    
    console.log("Connecting to the database...")
    dns.setServers(['8.8.8.8', '1.1.1.1']) // fixed the connection error with mongoDB Server
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Successfully connected to the database.")
  } catch (error) {
    // NEED A LOGGER
    if(error instanceof Error) {
      console.error(error.message)
    } else {
      console.error("Unknown error happened in the initalization of connection with database.")
    }
  }
}

export default initDatabase