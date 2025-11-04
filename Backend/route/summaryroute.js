import express from "express";
import { summarizeText } from "../controller/summarycontroller.js";

const router = express.Router();

router.post("/", summarizeText);

export default router;
