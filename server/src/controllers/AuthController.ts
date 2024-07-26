import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";

import { User } from "../models/user";
import config from "../config";
import { ClientError } from "../exceptions/clientError";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { NotFoundError } from "../exceptions/notFoundError";
import { processErrors } from "../utils/errorProcessing";
import { Error } from "mongoose";

class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    // Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) res.status(400).send();

    // Get user from database
    const user = await User.findOne({ username: username }).exec();

    // Check if encrypted password match
    if (!user || !(await user.isPasswordCorrect(password))) {
      res.status(401).send();
      return; // Add a return statement to exit the function if user is null
    }

    // Sing JWT, valid for 1 hour
    const token = sign(
      { userId: user._id.toString(), username: user.username, role: user.role },
      config.jwt.secret!,
      {
        expiresIn: "1h",
        notBefore: "0", // Cannot use before now, can be configured to be deferred
        algorithm: "HS256",
        audience: config.jwt.audience,
        issuer: config.jwt.issuer,
      }
    );

    // Send the jwt in the response
    res.type("json").send({ token: token });
  };

  static changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) res.status(400).send();

    // Get user from the database
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send();
      return; // Add a return statement to exit the function if user is null
    } else if (!(await user.isPasswordCorrect(oldPassword))) {
      res.status(401).send();
      return; // Add a return statement to exit the function if password is incorrect
    }

    // Store new pasword
    user.password = newPassword;

    try {
      // Just save, validation will happen when saving
      await user.save();
    } catch (e) {
      console.error(e);
      const error = e as Error.ValidationError;
      res.status(400).type("json").send(processErrors(error));
    }

    res.status(204).send();
  };
}
export default AuthController;
