import { mongo, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        minlength: 1
    },
    lastName: {
        type: String,
        trim: true,
        minlength: 1
    },
    middleInitial: {
        type: String,
        trim: true,
        minlength: 1
    },
    username: {
        type: String,
        sparse: true,
        unique: true,
        minlength: 3,
        trim: true
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
        index: true,
        default: 'user'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isSetUpDone : {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
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
    partialFilterExpression: { isEmailVerified: false } 
  }
);

userSchema.statics.hashPassword = async function(password) {
    const HASH_SALT = 10;
    return bcrypt.hash(password, HASH_SALT);
};

userSchema.methods.comparePassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toPublicJSON = function() {
  return {
    firstName: this.firstName,
    middleInitial: this.middleInitial,
    lastName: this.lastName,
    email: this.email,
    username: this.username
  };
};


const User = model("User", userSchema);

export default User;
