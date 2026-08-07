import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string("Email is required.")
      .min(1, "Email is required.")
      .email("Please provide a valid email address.")
      .toLowerCase()
      .trim(),

    password: z
      .string("Password is required.")
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .max(100, "Password cannot exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),

    confirmPassword: z
      .string("Please confirm your password.")
      .trim(),

    agreedToTerms: z
      .boolean("You must accept the terms and conditions.")
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions to proceed.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], 
  })