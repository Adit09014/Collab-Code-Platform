import express from 'express';
import {getServer, addServer} from '../controllers/server.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js'


const router= express.Router();


router.post("/addserver",protectRoute,addServer);

router.get("/getserver",protectRoute,getServer);

export default router;