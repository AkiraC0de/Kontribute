import { mongo, Schema, model } from "mongoose";

const sessionTokenSchema = new Schema({
  userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
      type: String,
      required: true,
      index: true,
      enum: ["emailVerification", "resetPasswordVerification" ,"resetPassword"]
  },
  updatedAt: {
      type: Date,
      default: Date.now
  },
  createdAt: {
      type: Date,
      default: Date.now,
      expires: 900 // 15 minutes (in seconds)
  }
})

sessionTokenSchema.methods.isOnCooldown = function() {
  const COOLDOWN_IN_MS = 1 * 60 * 1000; // 1 minute
  
  // Explicitly convert to Date object to prevent string coercion bugs
  const createdTime = new Date(this.createdAt).getTime();
  const cooldownEndTime = createdTime + COOLDOWN_IN_MS;
  
  // It's on cooldown if the current time hasn't passed the end time yet
  return Date.now() < cooldownEndTime;
};

const SessionToken = model("SessionToken", sessionTokenSchema);

export default SessionToken;

