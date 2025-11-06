import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

// ✅ Fix OverwriteModelError
const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);

export default Article;
