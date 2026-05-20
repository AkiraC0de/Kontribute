import ERROR_CODES from "../../config/errorCodes.js";
import GenericError from "../../errors/GenericError.js";
import InvitationNotFound from "../../errors/InvitationNotFound.js";
import ProjectNotFound from "../../errors/ProjectNotFound.js";
import TooManyRequest from "../../errors/TooManyRequest.js";
import mongoose from "mongoose";

import Invitation, { INVITATION_STATUS } from "../../models/invitation.model.js";
import Member, { MEMBER_ROLES, MEMBER_STATUS } from "../../models/member.model.js";
import Project, { ALLOWED_TO_FETCH_PROJECT_STATUS, MAX_LED_PROJECT_AMOUNT, PROJECT_STATUS } from "../../models/project.model.js"

import { generateCryptoToken } from "../../utils/utils.js";

export const createProject = async (userId, projectData) => {
  const { title, description, subject, deadline, settings } = projectData;

  await checkUserLedProjectCount(userId);
  
  const uniqueShareToken = generateCryptoToken();
  const newProject = await Project.create({
    title,
    description,
    subject,
    deadline: new Date(deadline),
    leader: userId,
    createdBy: userId,
    shareToken: uniqueShareToken,
    settings
  });

  // Add the creator of the project as the leader of the group.
  await addProjectMember(userId, newProject._id, MEMBER_ROLES.LEADER);

  return newProject;
}

export const fetchUserProjects = async (userId, statusFilter) => {
  return await Member.aggregate([
    { 
      $match: { userId: new mongoose.Types.ObjectId(userId), status: MEMBER_STATUS.ACTIVE } },
    {
      $lookup: {
        from: "projects",         
        localField: "projectId",   
        foreignField: "_id",       
        as: "project"
      }
    },
    { $unwind: "$project" },
    {  $match: { "project.status" : statusFilter || { $ne: PROJECT_STATUS.DELETED }  }  },
    {
      $project: {
        _id: "$project._id",
        title: "$project.title",
        description: "$project.description",
        subject: "$project.subject",
        status: "$project.status",
        leader: "$project.leader",
        settings: "$project.settings",
        createdAt: "$project.createdAt",
        myRole: "$role", 
        joinedAt: "$joinedAt"
      }
    }
  ]);
};

export const fetchUserLedProjects = async (userId, statusFilter) => {
  return await Member.aggregate([
    { 
      $match: { userId: new mongoose.Types.ObjectId(userId), role: MEMBER_ROLES.LEADER, status: MEMBER_STATUS.ACTIVE } },
    {
      $lookup: {
        from: "projects",         
        localField: "projectId",   
        foreignField: "_id",       
        as: "project"
      }
    },
    { $unwind: "$project" },
    {  $match: { "project.status" : statusFilter || { $ne: PROJECT_STATUS.DELETED }  }  },
    {
      $project: {
        _id: "$project._id",
        title: "$project.title",
        description: "$project.description",
        subject: "$project.subject",
        status: "$project.status",
        leader: "$project.leader",
        settings: "$project.settings",
        createdAt: "$project.createdAt",
        myRole: "$role", 
        joinedAt: "$joinedAt"
      }
    }
  ]);
}

export const switchMemberRole = (member1, member2) => {
  const temptRole = member1.role;
  member1.role = member2.role;
  member2.role = temptRole;

  return Promise.all([
    member1.save(),
    member2.save()
  ])
}

// -- invitation services

export const inviteMember = async (projectId, invitedBy, inviting) => {
  const conflictInvitation = await Invitation.findOne({projectId, inviting, status: "pending"});
  
  if(conflictInvitation) throw new GenericError(400, "User already invited.", ERROR_CODES.REQUEST_ERROR)

  return Invitation.create({
    projectId,
    invitedBy,
    inviting,
    status: "pending"
  })    
}

export const fetchInvitaionsByStatus = (userId, statusFilter) => {
  const query = statusFilter 
    ? {inviting: userId, status: statusFilter } 
    : {inviting: userId}

  return Invitation.find(query)
    .sort({ expiresAt: 1 })
    .populate("invitedBy", "firstName lastName username")
    .populate("projectId", "title description");
}

export const respondToInvitation = async (invitation, response) => {
  if(response === "accept"){
    await handleAcceptedInvitation(invitation)
  } else if(response === "reject"){
    await handleRejectedInvitation(invitation);
  } 

  return invitation;
}

const handleRejectedInvitation = async (invitation) =>
   invitation.changeStatus("rejected").save();

const handleAcceptedInvitation = async (invitation) => {
  // add the user to projects member
  await Member.create({
    projectId : invitation.projectId,
    userId : invitation.inviting,
  })

  await invitation.changeStatus("accepted").save()
}

export const updateProjectStatus = async (project, newStatus) => {
  // check if the current status is same as the new status
  if(project.status === newStatus){
    throw new GenericError(400, "Current status of the project is same as you want to change into.", ERROR_CODES.REQUEST_ERROR);
  }

  project.status = newStatus;
  return project.save() 
}

export const fetchUserMembershipByRole = (userId, roleFiter) => 
  Member.find({userId, role: roleFiter})

export const fetchUserMembershipByStatus = (userId, statusFilter) => 
  Member.find({userId, status: statusFilter})

export const validateQueryProjectStatus = (statusFilter) => {
  if (statusFilter && !Object.values(ALLOWED_TO_FETCH_PROJECT_STATUS).includes(statusFilter)) 
      throw new GenericError( 400, `Invalid project status. Allowed statuses are: ${ALLOWED_STATUS.join(", ")}.`,  ERROR_CODES.REQUEST_ERROR);
}

export const validateQueryInvitationStatus = (statusFilter) => {
  if (statusFilter && !Object.values(INVITATION_STATUS).includes(statusFilter)) 
      throw new GenericError( 400, `Invalid project status. Allowed statuses are: ${ALLOWED_STATUS.join(", ")}.`,  ERROR_CODES.REQUEST_ERROR);
}

const checkUserLedProjectCount = async (userId) => {
  const projectCount = await Project.countDocuments({ 
    leader: userId,  
    status: ALLOWED_TO_FETCH_PROJECT_STATUS.ACTIVE
  }).limit(MAX_LED_PROJECT_AMOUNT);

  if(projectCount >= MAX_LED_PROJECT_AMOUNT)
    throw new TooManyRequest(`You have reached the maximum amount of allowed ${MAX_LED_PROJECT_AMOUNT} Projects. You may finish or delete inactive projects.`);

  return projectCount;
}

export const addProjectMember = (userId, projectId, role = MEMBER_ROLES.MEMBER) => 
  Member.create({
    projectId,
    userId,
    role
  });

export const fetchProjectMembers = (projectId, statusFilter) =>
  Member.find({projectId, status: statusFilter})


export const updateProject = async (project, updateData) => {
  const { title, description, subject, deadline, settings } = updateData;

  if (title) project.title = title;
  if (description) project.description = description;
  if (subject) project.subject = subject;
  if (deadline) project.deadline = new Date(deadline);
  if (settings) {
    if (settings.allowMembersToInvite !== undefined) project.settings.allowMembersToInvite = settings.allowMembersToInvite;
    if (settings.maxMembers !== undefined) project.settings.maxMembers = settings.maxMembers;
  }

  await project.save();

  return {
    message: "Project updated successfully.",
    project
  };
}

export const findProjectByStatus = async (projectId, statusFilter) => {
  const project = await Project.findOne({status: statusFilter, _id: projectId});

  if(!project){
    throw new ProjectNotFound();
  }
  
  return project;
}

export const findPendingInvitationById = async (invitationId) => {
  const invitation = await Invitation.findOne({status: "pending", _id: invitationId});

  if(!invitation){
    throw new InvitationNotFound();
  }

  return invitation;
}
