import { Schema, model} from "mongoose";

const memberSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["leader", "member"],
    default: "member",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "left", "removed"],
    default: "active",
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
} , { _id: false });

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
  // Project Meta Data
  title: {
    type: String,
    required: true,
    maxlength : 256,
    trim: true,
  },
  description: {
    type: String,
    maxlength : 512,
    trim: true
  },
  subject : {
    type: String,
    maxlength : 256,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "completed", "archived"],
    default: "active"
  },
  deadline: {
    type: Date,
    required: true,
  }, 
  
  // Members Management
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  members: [memberSchema],
  

  // project settings
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

const Project = model("Project", projectSchema);

export default Project;