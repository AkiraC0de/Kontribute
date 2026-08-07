import Member, { MEMBER_ROLES, MEMBER_STATUS } from "../models/member.model.js";
import GenericError from "../errors/GenericError.js";
import ROLE_PERMISSIONS from "../config/rolePermissions.js";

const verifyProjectAccess = (requiredAction) => 
  async (req, res, next) => {
    const { projectId } = req.params; 
    const userId = req.user._id;      

    const membership = await Member.findOne({ 
      projectId, 
      userId, 
      status: MEMBER_STATUS.ACTIVE
    });

    if (!membership) 
      throw new GenericError(403, "You are not an active member of this project.");

    const allowedActions = ROLE_PERMISSIONS[membership.role] || [];

    if (!allowedActions.includes(requiredAction)) 
      throw new GenericError(403, "Unauthorized. Your role lacks permission for this action.");

    req.projectMembership = membership;
    
    next();
  }

export default verifyProjectAccess;