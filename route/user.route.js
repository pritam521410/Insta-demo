import express from "express";

import { register , loginUser , logoutUser , getuserById , getallUser} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/", register);
router.post("/login" , loginUser)
router.post("/logout" , logoutUser)
router.get("/" , getuserById)
router.get("/getallUser" , getallUser)

export default router;
