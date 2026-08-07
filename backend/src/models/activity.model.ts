import mongoose, { Schema, model, InferSchemaType } from "mongoose"

const activitySchema = new Schema({
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
  action: {
    type: String,
    required: true,
  },
  message: String,
  metadata: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

activitySchema.index({groupId: 1})
activitySchema.index({userId: 1})

export type ActivityType = InferSchemaType<typeof activitySchema>

const Activity = model("Activity", activitySchema)
export default Activity