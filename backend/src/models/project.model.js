import { Schema, model } from "mongoose";

export const MAX_LED_PROJECT_AMOUNT = 15;

export const PROJECT_STATUS = Object.freeze({
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  DELETED : "deleted"
});

export const ALLOWED_TO_FETCH_PROJECT_STATUS = Object.freeze({
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived"
});

const settingsSchema = new Schema({
  allowMembersToInvite: {
    type: Boolean,
    default: false
  },
  maxMembers: {
    type: Number,
    default: 8,
    min: 2,
    max: 50
  },
}, { _id: false });

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 256,
    trim: true,
  },
  description: {
    type: String,
    maxlength: 512,
    trim: true
  },
  subject: {
    type: String,
    maxlength: 256,
    trim: true,
  },
  status: {
    type: String,
    enum: Object.values(PROJECT_STATUS),
    default: PROJECT_STATUS.ACTIVE,
  },
  deadline: {
    type: Date,
    required: true,
  }, 
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  settings: {
    type: settingsSchema,
    default: () => ({})
  },  
  shareToken: {
    type: String,
    unique: true,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  archivedAt: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true
});

projectSchema.index({ leader: 1, status: 1 });

projectSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    subject: this.subject,
    status: this.status,
    leader: this.leader,
    settings: {
      maxMembers: this.settings.maxMembers
    },
    createdAt: this.createdAt
  };
};

const Project = model("Project", projectSchema);

export default Project;