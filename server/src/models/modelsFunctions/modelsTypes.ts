import mongoose from "mongoose";

type Article = {
  title: string;
  content: string;
  date: Date;
};
interface IUser {
  username: string;
  password: string;
  role: string;
  articles: Article[] | [];
}

interface userModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
  role: string;
  isPasswordCorrect(providedPassword: string): Promise<boolean>;
}
export { IUser, userModelInterface, UserDoc };
