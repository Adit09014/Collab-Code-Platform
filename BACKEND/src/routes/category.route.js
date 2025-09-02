import express from 'express';
import {protectRoute} from '../middleware/auth.middleware.js';
import { addCategory, getCategory } from '../controllers/category.controller.js';

const router= express.Router();


router.get("/getCategory/:serverId",protectRoute,getCategory);
router.post("/addCategory/:serverId",protectRoute,addCategory);

export default router;