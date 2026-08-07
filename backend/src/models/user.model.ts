import { Schema, model, InferSchemaType } from "mongoose"

export const USER_SEX = {
    MALE: "Male",
    FEMALE: "Female",
    PREFER_NOT_TO_SAY: "Prefer not to say",
} as const

export const USER_ROLE = {
    ADMIN: "admin",
    USER: "user"
}

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        sparse: true,
        unique: true,
        trim: true
    },
    sex: {
        type: String,
        trim: true,
        enum: Object.values(USER_SEX)
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
        select: false
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLE),
        default: USER_ROLE.USER
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
})

userSchema.index({ role: 1 })
userSchema.index({ isEmailVerified: 1 })


export type UserType = InferSchemaType<typeof userSchema>

const User = model("User", userSchema)
export default User
