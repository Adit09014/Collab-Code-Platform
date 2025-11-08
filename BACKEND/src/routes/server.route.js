import express from 'express';
import {getServer, addServer, addMember} from '../controllers/server.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js'
import {addRole} from '../controllers/role.controller.js'


const router= express.Router();


router.post("/addserver",protectRoute,addServer);

router.get("/getserver",protectRoute,getServer);

router.put("/addMember/:serverId/:memberId",protectRoute,addMember);

router.post("/roles/:serverId",protectRoute,addRole);

export default router;