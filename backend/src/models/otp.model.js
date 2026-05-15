import { Schema, model } from "mongoose";
import crypto from "crypto";

export const MAX_OTP_ATTEMPTS = 10;

const otpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    max: MAX_OTP_ATTEMPTS,
    default: 0,
  },
  type: {
    type: String,
    enum: ["emailVerification", "resetPasswordVerification"],
    required: true,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900 // 15 minutes (in seconds)
  }
});

otpSchema.methods.isValidPin = function(pin){
  const hashedPin = crypto
        .createHash('sha256')
        .update(pin)
        .digest('hex');

  return hashedPin === this.pin;
}

otpSchema.methods.isOnCooldown = function() {
  const coolDownInMs = 1 * 60 * 1000; // 1 minute
  
  return (new Date() - this.createdAt) > coolDownInMs;
};

otpSchema.methods.incrementAttempt = async function(){
  if(this.attempts < MAX_OTP_ATTEMPTS){
    this.attempts += 1;
    await this.save();
  }
}

const Otp = model("Otp", otpSchema);

export default Otp;