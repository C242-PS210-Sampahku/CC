import { checkSchema } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userValidator = checkSchema({
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email format",
    },
    isLength: {
      options: { max: 255 },
      errorMessage: "Email cannot exceed 255 characters",
    },
    custom: {
      options: async (email) => {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser) {
          throw new Error("Email is already registered.");
        }
        return true;
      },
    },
  },
  name: {
    notEmpty: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { max: 255 },
      errorMessage: "Name cannot exceed 255 characters",
    },
  },
  gender: {
    isIn: {
      options: [["male", "female"]],
      errorMessage: "Gender must be either male, female",
    },
  },
  username: {
    notEmpty: {
      errorMessage: "Username is required",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
    isLength: {
      options: { min: 3, max: 255 },
      errorMessage: "Username must be between 3 and 255 characters",
    },
  },
  no_hp: {
    optional: true,
    isMobilePhone: {
      options: ["id-ID"],
      errorMessage: "Invalid phone number format",
    },
    isLength: {
      options: { max: 20 },
      errorMessage: "Phone number cannot exceed 20 characters",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/,
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number, without symbols",
    },
  },
});

export default userValidator;
