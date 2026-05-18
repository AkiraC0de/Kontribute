import { Schema, model}  from "mongoose";

const INVITATION_EXPIRATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Invitation Schema
const invitationSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  inviting: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "expired"],
    default: "pending"
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + INVITATION_EXPIRATION),
    expires: 0 // MongoDB will auto-delete the doc when this time is reached
  },
  respondedAt: Date
});

invitationSchema.index({ projectId: 1, inviting: 1 }, { unique: true });

const Invitation = model("Invitation", invitationSchema);

export default Invitation;