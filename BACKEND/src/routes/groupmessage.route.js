import express from 'express';
import {protectRoute} from '../middleware/auth.middleware.js'
import { getChannelMessages, getChannelUsers, sendChannelMessages } from '../controllers/groupmessage.controller.js';

const router= express.Router();

router.get("/user/:channelId",protectRoute,getChannelUsers);
router.get("/:channelId",protectRoute,getChannelMessages);
router.post("/:channelId",protectRoute,sendChannelMessages);


export default router;