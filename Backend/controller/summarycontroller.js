import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


export const summarizeText = async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const summary = response.data[0]?.summary_text;
    if (!summary) {
      return res.status(500).json({ message: "Failed to summarize text" });
    }

    res.json({ summary });
  } catch (error) {
  console.error("Full error response:", error.response?.data || error.message);
  res.status(500).json({
    message: "Failed to summarize text",
    error: error.response?.data || error.message,
  });
}

};
