import express from 'express'
import {signup,login,verifyToken} from "../controller/usercontroller.js"
import { requireAuth } from '../middleware/auth.js';
const router= express.Router()

router.get("/verify", verifyToken);
router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});
router.post("/signup",signup)
router.post("/login",login)

export default router;