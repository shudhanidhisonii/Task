import express from "express";
import { addHistory, getHistory, deleteHistory } from "../controller/historycontroller.js";
// import { requireAuth } from "../middleware/authMiddleware.js"; // if login system exists

const router = express.Router();

// Routes
router.post("/add", /*requireAuth,*/ addHistory);
router.get("/all", /*requireAuth,*/ getHistory);
router.delete("/:id", /*requireAuth,*/ deleteHistory);

export default router;
