import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const Home = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [activeTab, setActiveTab] = useState("Free");
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  // Fetch current logged-in user
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => console.log("No logged-in user"));
  }, []);

  // Fetch articles from DB
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/article/all`, { withCredentials: true })
      .then((res) => setArticles(res.data))
      .catch((err) => {
        console.error("Failed to fetch articles", err);
        toast.error("Failed to load articles");
      });
  }, []);

  // Summarize textarea text
  const handleSummarizeText = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to summarize");
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/summarize`,
        { text: inputText, userId: user?._id, category: activeTab },
        { withCredentials: true }
      );

      const summaryText = res.data.summary?.summary || res.data.summary;

      if (!summaryText) {
        toast.error("Unexpected response format");
        return;
      }

      // Save history
      await axios.post(
        `${BASE_URL}/api/history/add`,
        { userId: user?._id, article: inputText, summary: summaryText },
        { withCredentials: true }
      );

      setSummary(summaryText);
      toast.success("Summary generated and saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to summarize or save history");
    }
  };

  // Summarize selected article
  const handleSummarizeArticle = async (article) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/summarize`,
        { text: article.content, userId: user?._id, category: "Article" },
        { withCredentials: true }
      );

      const summaryText = res.data.summary?.summary || res.data.summary;

      if (!summaryText) {
        toast.error("Unexpected response format");
        return;
      }

      // Save history
      await axios.post(
        `${BASE_URL}/api/history/add`,
        { userId: user?._id, article: article.content, summary: summaryText },
        { withCredentials: true }
      );

      setInputText(article.content); // optional: shows article content in textarea
      setSummary(summaryText);
      toast.success("Article summarized and saved to history!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to summarize article");
    }
  };

  const tabs = [
    "Free",
    "Article",
    "Academic",
    "Simple",
    "Formal",
    "Informal",
    "Expand",
    "Shorten",
    "History",
  ];

  return (
    <div className="home-page">
      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              if (tab === "History") navigate("/history");
              else setActiveTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Textarea & Summary */}
      <div className="main-container">
        <div className="text-area">
          <h3>Insert (English) text here</h3>
          <textarea
            placeholder="Enter your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows="12"
          />
          <button onClick={handleSummarizeText}>Summarize</button>
          <p className="word-count">
            {inputText.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        <div className="summary-area">
          <h3>Summarized text will appear here</h3>
          <div className="summary-box">
            {summary ? (
              <p>{summary}</p>
            ) : (
              <p className="placeholder">No summary yet...</p>
            )}
          </div>
          <p className="word-count">
            {summary.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      </div>

      {/* Article Cards */}
      <div className="article-cards">
        <h3>Articles</h3>
        <div className="cards-container">
          {articles.length === 0 ? (
            <p>No articles available</p>
          ) : (
            articles.map((art) => (
              <div key={art._id} className="article-card">
                <h4>{art.title}</h4>
                <p>{art.content.substring(0, 100)}...</p>
                <button onClick={() => handleSummarizeArticle(art)}>
                  Summarize Article
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
