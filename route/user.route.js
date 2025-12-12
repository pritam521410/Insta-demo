import express from "express";

import { register , loginUser} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/", register);
router.post("/login" , loginUser)

export default router;
