import express from 'express'
import {signup,login,verifyToken} from "../controller/usercontroller.js"
const router= express.Router()

router.get("/verify", verifyToken);

router.post("/signup",signup)
router.post("/login",login)

export default router;