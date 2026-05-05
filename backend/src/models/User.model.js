import { Schema } from "mongoose";
import bcryptjs from "bcryptjs";

const User = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    middleName: {
        type: String,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true
});


// Add Time To Live (TTL) for unverified accounnts
// expireAfterSeconds: 900 (15 minutes)
userSchema.index(
  { createdAt: 1 }, 
  { 
    expireAfterSeconds: 900, 
    partialFilterExpression: { isVerified: false } 
  }
);

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

userSchema.methods.toPublicJSON = function() {
  return {
    firstName: this.firstName,
    middleName: this.middleName,
    lastName: this.lastName,
    email: this.email,
  };
};

export default User;
