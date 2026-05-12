import GenericError from "../errors/GenericError.js";
import ERROR_CODES from "../config/errorCodes.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (userData) => {
  const { firstName, lastName, middleInitial, email, password} = userData;

  const existingUser = await User.findOne({email});
  
  // Check if the user already exist and is VERIFIED.
  if(existingUser && existingUser.isEmailVerified){
    throw new GenericError(400, "The email has already been registered.", ERROR_CODES.EMAIL_ALREADY_REGISTERED)
  }

  // hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // If the user exist but are UNVERIFIED, overwrite/update their details
  if(existingUser && !existingUser.isEmailVerified){
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.middleInitial = middleInitial;
    existingUser.password = hashedPassword;
    
    // Resets the TTL index timer so the account doesn't expire mid-verification
    existingUser.createdAt = new Date(); 

    await existingUser.save();
    
    return existingUser.toPublicJSON();
  }

  const newUser = await User.create({
    firstName,
    lastName,
    middleInitial,
    email,
    password: hashedPassword
  });

  return newUser.toPublicJSON();
}

//

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: "15m" } 
  );

  const refreshToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};