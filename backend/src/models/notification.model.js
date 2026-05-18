import { Schema, model } from "mongoose";

const NOTIFICATION_TYPES = {
  PROJECT_INVITATION: "projectInvitation",
  INVITATION_ACCEPTED: "invitationAccepted",
  INVITATION_REJECTED: "invitationRejected",
  MEMBER_JOINED: "memberJoined",
  MEMBER_LEFT: "memberLeft",
  LEADERSHIP_TRANSFERRED: "leadershipTransferred",
  PROJECT_STATUS_CHANGED: "projectStatusChanged",
  PROJECT_DEADLINE_APPROACHING: "projectDeadlineApproaching",
  PROJECT_DEADLINE_PASSED: "projectDeadlinePassed",
};

const NOTIFICATION_READ_STATUS = {
  UNREAD: "unread",
  READ: "read",
};

const notificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(NOTIFICATION_TYPES),
    index: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 256,
  },
  message: {
    type: String,
    required: true,
    maxlength: 512,
  },
  data: {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    relatedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    invitationId: {
      type: Schema.Types.ObjectId,
    },
  },
  status: {
    type: String,
    enum: Object.values(NOTIFICATION_READ_STATUS),
    default: NOTIFICATION_READ_STATUS.UNREAD,
  },
}, {
  timestamps: true,
});

notificationSchema.methods.markAsRead = function() {
  this.status = NOTIFICATION_READ_STATUS.READ;
  return this;
};

notificationSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    type: this.type,
    title: this.title,
    message: this.message,
    data: this.data,
    status: this.status,
    createdAt: this.createdAt,
  };
};

notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = model("Notification", notificationSchema);

export { NOTIFICATION_TYPES, NOTIFICATION_READ_STATUS };
export default Notification;