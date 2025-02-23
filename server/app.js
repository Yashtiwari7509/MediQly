import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectToDb from "./db/db.js";
import userModel from "./models/user.model.js";
import userRouter from "./routes/user.route.js";
connectToDb();

const app = express(); // Initialize app first

app.use(cors()); // Now use cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRouter);

export default app;
