import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Home.css";

const Home = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");

const handleSummarize = async () => {
  if (!inputText.trim()) {
    toast.error("Please enter some text to summarize");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/summarize", { text: inputText });
    console.log("Response from backend:", res.data);

    if (res.data && res.data.summary) {
      setSummary(res.data.summary);
    } else if (typeof res.data === "string") {
      setSummary(res.data);
    } else {
      toast.error("Unexpected response format");
      console.error("Unexpected data:", res.data);
    }

  } catch (err) {
    console.error("Frontend error:", err);
    toast.error("Failed to summarize text");
  }
};

  return (
    <div className="home-container">
      <h1>Text Summarizer</h1>

      <textarea
        placeholder="Enter your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows="10"
      ></textarea>

      <button onClick={handleSummarize}>Summarize</button>

      {summary && (
        <div className="summary-box">
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
