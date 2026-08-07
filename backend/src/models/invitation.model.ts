import mongoose, { Schema, model, InferSchemaType } from "mongoose"

const INVITATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  EXPIRED: "expired", // currently being manually handled, should be in a cron jobs
} as const

const INVITATION_EXPIRATION_IN_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

const invitationSchema = new Schema({
  groupId: {
    type: mongoose.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  fromUserId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(INVITATION_STATUS),
    default: INVITATION_STATUS.PENDING
  },
  invitedAt: {
      type: Date,
      default: Date.now
    },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + INVITATION_EXPIRATION_IN_MS),
  },
  respondedAt: Date
})

invitationSchema.index({toUserId: 1})
invitationSchema.index({fromUserId: 1})

export type InvitationType = InferSchemaType<typeof invitationSchema>

const Invitation = model("Invitation", invitationSchema)
export default Invitation