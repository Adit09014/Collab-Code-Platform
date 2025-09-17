import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { addProject, getProject } from '../controllers/project.controller.js';

const router= express.Router();


router.get("/getProject/:folderId",protectRoute,getProject);
router.post("/addProject/:folderId",protectRoute,addProject);

export default router;