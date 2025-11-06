import History from "../model/historyModel.js";

// ✅ Create new history entry
export const addHistory = async (req, res) => {
  try {
    const { article, summary } = req.body;
    const userId = req.user ? req.user._id : null; // optional

    const newHistory = await History.create({ article, summary, userId });
    res.status(201).json({ message: "History saved successfully", history: newHistory });
  } catch (err) {
    console.error("Error saving history:", err);
    res.status(500).json({ message: "Error saving history", error: err.message });
  }
};


// ✅ Fetch all history (user-specific if userId available)
export const getHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const histories = userId
      ? await History.find({ userId }).sort({ createdAt: -1 })
      : await History.find().sort({ createdAt: -1 });

    res.status(200).json(histories);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
};

// ✅ Delete single history entry
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await History.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "History not found" });

    res.status(200).json({ message: "History deleted successfully" });
  } catch (err) {
    console.error("Error deleting history:", err);
    res.status(500).json({ message: "Error deleting history", error: err.message });
  }
};
