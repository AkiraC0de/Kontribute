import mongoose, { Schema, model, InferSchemaType } from "mongoose"

export const TASK_UGENT_LEVEL = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const

export const TASK_STATUS = {
  TODO: "todo",
  INPROGRESS: "in_progress",
  CHECKING: "checking",
  DONE: "done"
} as const

const taskSchema = new Schema({
  groupId: {
    type: mongoose.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  urgentLevel: {
    type: String,
    enum: Object.values(TASK_UGENT_LEVEL),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.TODO
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deadline: Date // deadline is not required
}, {
  timestamps: true
})

taskSchema.index({groupId: 1})
taskSchema.index({assignedTo: 1})
taskSchema.index({createdBy: 1})

export type TaskType = InferSchemaType<typeof taskSchema>

const Task = model("Task", taskSchema)
export default Task