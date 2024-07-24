import { Router, Request, Response, NextFunction } from "express";
import UserController from "../controllers/UserController";

// Middleware
import { asyncHandler } from "../middleware/asyncHandler";
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";

const router = Router();

// Get all users
router.get(
  "/",
  ///[checkJwt, checkRole(["USER", "ADMIN"])],
  asyncHandler(UserController.listAll)
);
// Get one user
router.get(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole(["USER", "ADMIN"])],
  asyncHandler(UserController.getOneById)
);

// Create a new user
router.post("/", [], (req: Request, res: Response) =>
  UserController.newUser(req, res)
);

// Edit one user
router.put(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole(["USER", "ADMIN"])],
  asyncHandler(UserController.editUser)
);

// Delete one user
router.delete(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole(["ADMIN"])],
  asyncHandler(UserController.deleteUser)
);

export default router;
