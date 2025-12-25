import express from "express";
import {call} from "../controllers/call.controller.js"


const router=express.Router()

router.get("/callId",call)

export default router;