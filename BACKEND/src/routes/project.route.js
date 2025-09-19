import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { addProject, codeChange, getCode, getProject } from '../controllers/project.controller.js';

const router= express.Router();


router.get("/getProject/:folderId",protectRoute,getProject);
router.post("/addProject/:folderId",protectRoute,addProject);
router.put("/codeChange/:fileId",protectRoute,codeChange);
router.get("/getCode/:fileId",protectRoute,getCode);

export default router;