import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Home.css";

const Home = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [activeTab, setActiveTab] = useState("Free");

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to summarize");
      return;
    }

    try {
      const res = await axios.post("https://task-8-itgs.onrender.com/summarize", { text: inputText });
      console.log("Response from backend:", res.data);

      if (res.data && res.data.summary) {
        setSummary(res.data.summary);
      } else if (typeof res.data === "string") {
        setSummary(res.data);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (err) {
      console.error("Frontend error:", err);
      toast.error("Failed to summarize text");
    }
  };

  const tabs = ["Free", "Standard", "Academic", "Simple", "Formal", "Informal", "Expand", "Shorten"];

  return (
    <div className="home-page">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="main-container">
        <div className="text-area">
          <h3>Insert (English) text here</h3>
          <textarea
            placeholder="Enter your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows="12"
          />
          <button onClick={handleSummarize}>Summarize</button>
          <p className="word-count">{inputText.trim().split(/\s+/).filter(Boolean).length} words</p>
        </div>

        <div className="summary-area">
          <h3>Summarized text will appear here</h3>
          <div className="summary-box">
            {summary ? <p>{summary}</p> : <p className="placeholder">No summary yet...</p>}
          </div>
          <p className="word-count">
            {summary.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
