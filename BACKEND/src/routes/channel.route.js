import express from 'express';
import {addChannel, getChannel} from '../controllers/channel.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router= express.Router();


router.get("/getchannel/:serverId",protectRoute,getChannel);

router.post("/addchannel/:serverId",protectRoute,addChannel);

export default router;
