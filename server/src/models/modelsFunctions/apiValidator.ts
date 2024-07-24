import { userSchema, User } from "../user";
import { IUser } from "./modelsTypes";
import bcrypt from "bcrypt";
// Hash the password prior to saving the user
export const apiValidator = () => {
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  // Compare passwords, instance method for the user
  userSchema.method(
    "isPasswordCorrect",
    async function (providedPassword: string): Promise<boolean> {
      return await bcrypt.compare(providedPassword, this.password);
    }
  );

  userSchema.statics.build = (attr: IUser) => {
    return new User(attr);
  };

  userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
      delete returnedObject.password;
      delete returnedObject.createdAt;
      delete returnedObject.updatedAt;
    },
  });
};
;