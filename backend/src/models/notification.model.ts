import mongoose, { Schema, model, InferSchemaType } from "mongoose"

// NOTES:
// -deleted notif actually means deleted in the database

const NOTIFICATION_TYPES = {
  GROUP_INVITATION: "group_invitation",
  INVITATION_ACCEPTED: "invitation_accepted",
  INVITATION_REJECTED: "invitation_rejected",
  MEMBER_JOINED: "member_joined",
  MEMBER_LEFT: "member_left",
  LEADERSHIP_TRANSFERRED: "leadership_transferred",
  GROUP_STATUS_CHANGED: "group_status_changed",
  TASK_STATUS_CHANGED: "task_status_changed",
  TASK_DEADLINE_APPROACHING: "task_deadline_approaching",
  TASK_DEADLINE_PASSED: "task_deadline_passed",
} as const

const NOTIFICATION_READ_STATUS = {
  UNREAD: "unread",
  READ: "read",
} as const

const notificationSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: Object.values(NOTIFICATION_TYPES),
    required: true,
  },
  readStatus: {
    type: String,
    enum: Object.values(NOTIFICATION_READ_STATUS),
    default: NOTIFICATION_READ_STATUS.UNREAD
  },
  readAt: Date
})

notificationSchema.index({userId: 1, readStatus: 1})

export type NotificationType = InferSchemaType<typeof notificationSchema>

const Notification = model("Notification", notificationSchema)
export default Notification