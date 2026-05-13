import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["emailVerification"],
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

otpSchema.methods.comparePin = function(pin){
  const hashedPin = crypto
        .createHash('sha256')
        .update(pin)
        .digest('hex');

  return hashedPin === pin;
}

otpSchema.methods.isOnCooldown = function() {
  const coolDownInMs = 1 * 60 * 1000; // 1 minute
  
  return (new Date() - this.createdAt) > coolDownInMs;
};

const Otp = model("Otp", otpSchema);

export default Otp;