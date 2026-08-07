import { Schema, model, InferSchemaType } from "mongoose"

export const GROUP_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  DELETED : "deleted"
} as const

const groupSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: String,
  status: {
    type: String,
    enum: Object.values(GROUP_STATUS),
    default: GROUP_STATUS.ACTIVE
  },
  shareToken: {
    type: String,
    unique: true,
    required: true
  },
}, { 
  timestamps: true
})

groupSchema.index({status: 1})

export type GroupType = InferSchemaType<typeof groupSchema>

const Group = model("Group", groupSchema)
export default Group