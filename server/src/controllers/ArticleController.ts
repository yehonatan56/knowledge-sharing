import { Request, Response } from "express";
import { Article, Follwing } from "../models/modelsFunctions/modelsTypes"; // Import your user and article models
import { User } from "../models/user";
import { sendMessage } from "../whatsapp";
export const createArticle = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, content } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new article
    const article: Article = {
      title,
      content,
      date: new Date(),
    };

    // Add the article to the user's articles array

    sendMessage(user.followers as [Follwing], `New article: ${title}`, {
      customName: true,
    });
    user.articles = [...user.articles, article];
    await user.save();

    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
