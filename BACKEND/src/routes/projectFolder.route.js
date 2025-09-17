import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { addProjectFolder, getProjectFolder } from '../controllers/projectFolder.controller.js';

const router = express.Router();

router.get("/getFolder/:channelId",protectRoute,getProjectFolder);
router.post("/addFolder/:channelId",protectRoute,addProjectFolder);

export default router;