import { NextFunction, Request, Response } from "express";
import { Error, FlattenMaps, LeanDocument } from "mongoose";
import { ClientError } from "../exceptions/clientError";
import { ForbiddenError } from "../exceptions/forbiddenError";
import { NotFoundError } from "../exceptions/notFoundError";
import { CustomRequest } from "../middleware/checkJwt";
import { User } from "../models/user";
import { ROLES } from "../utils/constants";
import { processErrors } from "../utils/errorProcessing";
import { IUser } from "../models/modelsFunctions/modelsTypes";

class UserController {
  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    // Define the query to execute based on the role
    let query = User.find();
    // if ((req as CustomRequest).token.payload.role === ROLES.USER) {
    //   query = User.find({ role: ROLES.USER });
    // } else {
    //   query = User.find();
    // }

    // Execute the query
    const users = await query.select([
      "_id",
      "username",
      "role",
      "articles",
      "followers",
    ]);

    // Send the users object
    res.status(200).type("json").send(users);
  };

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get the ID from the url
    const id: string = req.params.id;

    // Validate permissions
    if (
      (req as CustomRequest).token.payload.role === ROLES.USER &&
      req.params.id !== (req as CustomRequest).token.payload.userId
    ) {
      throw new ForbiddenError("Not enough permissions");
    }

    // Mongoose automatically casts the id to ObjectID
    const user = await User.findById(id).select([
      "_id",
      "username",
      "role",
      "articles",
      "followers",
    ]);
    if (!user) throw new NotFoundError(`User with ID ${id} not found`);

    res.status(200).type("json").send(user?.toJSON());
  };

  static newUser = async (
    req: { body: { username: any; password: any; role: any; articles: any } },
    res: any
  ) => {
    // Get parameters from the body
    let { username, password, role, articles } = req.body;
    let user;
    try {
      // user = User.build({ username, password, role, articles } as IUser);
      user = new User({ username, password, role, articles }); // Save the user
      await user.save();
      res.status(201).type("json").send(user?.toJSON());
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      res.status(400).type("json").send(processErrors(error));
    }

    // If all ok                 , send 201 response
  };

  static editUser = async (req: Request, res: Response, next: NextFunction) => {
    // Get the ID from the url
    const id = req.params.id;

    // Validate permissions
    if (
      (req as CustomRequest).token.payload.role === ROLES.USER &&
      req.params.id !== (req as CustomRequest).token.payload.userId
    ) {
      throw new ForbiddenError("Not enough permissions");
    }

    // Get values from the body
    const { username, role } = req.body;

    // Verify you cannot make yourself an admin if you are a user
    if (
      (req as CustomRequest).token.payload.role === ROLES.USER &&
      role === ROLES.ADMIN
    ) {
      throw new ForbiddenError("Not enough permissions");
    }

    // Mongoose automatically casts the id to ObjectID
    const user = await User.findById(id).select(["_id", "username", "role"]);
    if (!user) throw new NotFoundError(`User with ID ${id} not found`);

    // Edit the properties
    if (username) user.username = username;
    if (role) user.role = role;

    // Save and catch all validation errors
    try {
      await user.save();
      res.status(204).type("json").send(user.toJSON());
    } catch (e) {
      const error = e as Error.ValidationError;
      res.status(400).type("json").send(processErrors(error));
    }
  };

  static deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get the ID from the url
    const id = req.params.id;

    // Mongoose automatically casts the id to ObjectID
    const user = await User.findById(id).select([
      "_id",
      "username",
      "role",
      "articles",
      "followers",
    ]);
    if (!user) throw new NotFoundError(`User with ID ${id} not found`);

    await user.delete();

    // After all send a 204 (no content, but accepted) response
    res.status(204).type("json").send();
  };
}

export default UserController;
