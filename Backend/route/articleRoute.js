import express from "express";
import Article from "../model/articleModel.js";
import { requireAuth } from "../middleware/auth.js";
import History from "../model/historyModel.js";
import axios from "axios";

const router = express.Router();

// Get all articles
router.get("/all", requireAuth, async (req, res) => {
  try {
    const articles = await Article.find({});
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

// Summarize an article and save to history
router.post("/summarize/:id", requireAuth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Call your summarizer API
    const summaryRes = await axios.post(
      `${process.env.BASE_URL}/summarize`,
      { text: article.content, userId: req.user._id },
      { withCredentials: true }
    );

    const summaryText = summaryRes.data.summary || summaryRes.data.summary?.summary;

    // Save to history
    const historyItem = await History.create({
      userId: req.user._id,
      article: article.content,
      summary: summaryText,
    });

    res.status(200).json({ article, summary: summaryText, historyItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to summarize article" });
  }
});

export default router;
