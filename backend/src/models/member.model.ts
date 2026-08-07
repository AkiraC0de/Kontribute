import mongoose, { Schema, model, InferSchemaType } from "mongoose"

const MEMBER_ROLES = {
  LEADER: "leader",
  COLEADER: "coleader",
  MEMBER: "member",
}

const memberSchema = new Schema({
  groupId: {
    type: mongoose.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(MEMBER_ROLES),
    default: MEMBER_ROLES.MEMBER
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false
})

memberSchema.index({ groupId: 1, role: 1 });
memberSchema.index({ userId: 1 });

export type MemberType = InferSchemaType<typeof memberSchema>

const Member = model("Member", memberSchema)
export default Member