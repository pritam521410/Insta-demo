import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import userRoute from "./route/user.route.js";
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(express.json());

connectDB();

app.use("/api/user", userRoute);
app.listen(PORT, () => {
  console.log("server is listening port 5000");
});
