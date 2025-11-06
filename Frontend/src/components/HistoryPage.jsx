import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./HistoryPage.css";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/history/all`, { withCredentials: true })
      .then((res) => {
        console.log("History data:", res.data);
        setHistory(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load history");
      });
  }, []);

  return (
    <div className="history-page">
      <h2> History</h2>

      {history.length === 0 ? (
        <p>No summaries found yet.</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item._id} className="history-card">
              <p>
                <strong> Original:</strong> {item.article}
              </p>
              <p>
                <strong> Summary:</strong> {item.summary}
              </p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
