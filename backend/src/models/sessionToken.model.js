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
  const coolDownInMs = 1 * 60 * 1000; // 1 minute
  
  return (new Date() - this.createdAt) > coolDownInMs;
};

const SessionToken = model("SessionToken", sessionTokenSchema);

export default SessionToken;

