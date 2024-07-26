import express from "express";
import { createArticle } from "../controllers/ArticleController";

const router = express.Router();

// POST /api/users/:userId/articles
router.post("/:userId/articles", createArticle);

export default router;
