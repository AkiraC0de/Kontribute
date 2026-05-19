import { Schema, model} from "mongoose";
import GenericError from "../errors/GenericError.js";
import ERROR_CODES from "../config/errorCodes.js";

export const MAX_LED_PROJECT_AMOUNT = 15;

export const PROJECT_STATUS = {
  ACTIVE : "active",
  COMPLETED : "completed",
  ARCHIVED : "archived"
}

export const ALLOWED_TO_FETCH_PROJECT_STATUS = {
  ACTIVE : "active",
  COMPLETED : "completed"
}

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
    enum: Object.values(PROJECT_STATUS),
    default: PROJECT_STATUS.ACTIVE,
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

projectSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    subject: this.subject,
    status: this.status,
    members: this.members,
    leader: this.leader,
    settings: {
      maxMembers: this.settings.maxMembers
    },
    createdAt: this.createdAt
  }
}

projectSchema.methods.isMember = function (userId){
  return this.members.some(m => m.userId.equals(userId) && m.status === "active");
}

projectSchema.methods.addMember = function(userId) {
  // check if user already a member
  const alreadyMember = this.members.some(m => m.userId.equals(userId));
  if(alreadyMember){
    throw new GenericError(400, "This user is already member of the project.", ERROR_CODES.REQUEST_ERROR);
  }

  // Check if group is full
  const activeCount = this.members.filter(m => m.status === "active").length;
  if (activeCount >= this.settings.maxMembers) {
    throw new GenericError(400, "The project is already full.");
  }

  this.members.push({
    userId,
    role: "member"
  })

  return this;
}

// Remove member
projectSchema.methods.removeMember = function(userId) {
  const member = this.members.find(m => m.userId.equals(userId));
  if (!member) {
    throw new GenericError(400, "User is not a member.", ERROR_CODES.NOT_FOUND);
  }

  this.members.pull({ userId: userId });
  return this;
};

projectSchema.methods.transferLeadership = function(fromUserId, toUserId) {
  // Verify that the 'fromUser' is actually the current leader
  const currentLeader = this.members.find(m => m.userId.equals(fromUserId) && m.role === "leader");
  if (!currentLeader) {
    throw new GenericError(403, "You don't have the authority to transfer leadership.", ERROR_CODES.REQUEST_ERROR);
  }

  // transferring leadership to yourself
  if (fromUserId.toString() === toUserId.toString()) {
    throw new GenericError(400, "You are already the leader of this project.", ERROR_CODES.REQUEST_ERROR);
  }

  // Verify that the 'toUser' is an active member of this project
  const targetMember = this.members.find(m => m.userId.equals(toUserId) && m.status === "active");
  if (!targetMember) {
    throw new GenericError(404, "Active member not found in this project.", ERROR_CODES.REQUEST_ERROR);
  }

  this.leader = toUserId;

  // Swap roles inside the subdocument members array
  currentLeader.role = "member";
  targetMember.role = "leader";
  
  return this;
};

projectSchema.index({ "members.userId": 1, "members.status": 1 });
projectSchema.index({ leader: 1, status: 1 });

const Project = model("Project", projectSchema);

export default Project;