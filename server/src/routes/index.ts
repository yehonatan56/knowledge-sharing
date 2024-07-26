import { Router } from "express";
import auth from "./auth";
import user from "./user";
import article from "./article";
const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/", article);
export default routes;
