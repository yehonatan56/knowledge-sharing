import mongoose from "mongoose";
import { ROLES } from "../utils/constants";
import { IUser, UserDoc, userModelInterface } from "./modelsFunctions/modelsTypes";
import { usernameValidator } from "./modelsFunctions/validators";
import { apiValidator } from "./modelsFunctions/apiValidator";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [8, "Username too short"],
      maxLength: [40, "Username too long"],
      validate: {
        validator:usernameValidator,
        message: "Username already in use.",
      }
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password too short"],
      maxLength: [120, "Password too long"],
    },
    role: {
      type: String,
      required: true,
      enum: [ROLES.USER, ROLES.ADMIN],
      default: ROLES.USER,
    },
    articles: [],
  },
  { timestamps: true }
);

const User = mongoose.model<UserDoc, userModelInterface>("User", userSchema);
apiValidator(); 
export { User , userSchema};
