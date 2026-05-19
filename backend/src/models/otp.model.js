import { Schema, model } from "mongoose";
import crypto from "crypto";

export const MAX_OTP_ATTEMPTS = 10;

export const OTP_TYPES = {
  EMAIL_VERIFICATION : "emailVerification",
  RESET_PASS_VERIFICATION : "resetPasswordVerification"
}


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
    enum: Object.values(OTP_TYPES),
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
  const COOLDOWN_IN_MS = 1 * 60 * 1000; // 1 minute
  
  // Explicitly convert to Date object to prevent string coercion bugs
  const createdTime = new Date(this.createdAt).getTime();
  const cooldownEndTime = createdTime + COOLDOWN_IN_MS;
  
  // It's on cooldown if the current time hasn't passed the end time yet
  return Date.now() < cooldownEndTime;
};

otpSchema.methods.incrementAttempt = function(){
  if(this.attempts < MAX_OTP_ATTEMPTS){
    this.attempts += 1;
  }

  return this;
}

const Otp = model("Otp", otpSchema);

export default Otp;