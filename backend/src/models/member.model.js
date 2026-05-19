import { Schema, model } from "mongoose";

export const MEMBER_ROLES = Object.freeze({
  LEADER : "leader",
  MEMBER : "member"
})

export const MEMBER_STATUS = Object.freeze({
  ACTIVE : "active",
  LEFT : "left",
  KICKED : "kicked",
})

export const MEMBER_ACCESS = Object.freeze({
  [MEMBER_ROLES.LEADER] : {
    FETCH_PROJECT : "fetchProject",
    FETCH_PROJECT : "fetchMembers",
    UPDATE_PROJECT_STATUS : "updateProjectStatus",
  },  
  [MEMBER_ROLES.MEMBER] : {
    FETCH_PROJECT : "fetchProject",
    FETCH_PROJECT : "fetchMembers"
  }
})

const memberSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(MEMBER_ROLES),
    default: MEMBER_ROLES.MEMBER,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(MEMBER_STATUS),
    default: MEMBER_STATUS.ACTIVE,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

memberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

const Member = model("Member", memberSchema);

export default Member;