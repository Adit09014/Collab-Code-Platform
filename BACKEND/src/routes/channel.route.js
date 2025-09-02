import express from 'express';
import {addChannel, getChannel} from '../controllers/channel.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router= express.Router();


router.get("/getchannel/:categoryId",protectRoute,getChannel);

router.post("/addchannel/:categoryId",protectRoute,addChannel);

export default router;
