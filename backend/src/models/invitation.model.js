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

invitationSchema.methods.changeStatus = function(status){
  this.status = status;

  return this
}

invitationSchema.methods.toPublicJSON = function(){
  return{
    _id: this._id,
    project: this.projectId,
    inviting: this.inviting,
    status: this.status,
    invitedBy: this.invitedBy,
    invitedAt: this.invitedAt,
    expiresAt: this.expiresAt,
  }
}

invitationSchema.index({ projectId: 1, inviting: 1 });
invitationSchema.index({ inviting: 1, status: 1});

const Invitation = model("Invitation", invitationSchema);

export default Invitation;