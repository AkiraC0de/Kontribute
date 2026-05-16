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
    default: "active"
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
} , { _id: false });

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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Members Management
  members: [memberSchema],
  maxMembers: {
    type: Number,
    default: 8,
    min: 2,
    max: 50
  },

  shareToken: {
    type: String,
    unique: true,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  archivedAt: {
    type: Date,
    default: null
  }
})