import express from "express"
import {signup,login,logout,updateProfile,checkAuth, addFriend} from '../controllers/auth.controller.js'
import {protectRoute} from '../middleware/auth.middleware.js'

const router = express.Router();


router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuth)

router.put("/addFriend/:userId",protectRoute,addFriend)

export default router;

