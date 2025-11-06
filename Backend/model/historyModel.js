import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if login exists
    article: { type: String, required: true },
    summary: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// ✅ Fix OverwriteModelError
const History = mongoose.models.History || mongoose.model("History", historySchema);

export default History;
