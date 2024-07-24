import { User } from "../user";

export const usernameValidator = async function (v: string): Promise<boolean> {
  let doc: any = await User.findOne({ username: v });
  // @ts-ignore
  if (doc) return this._id.toString() === doc._id.toString();
  else return Boolean(!doc);
};
