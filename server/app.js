import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectToDb from "./db/db.js";
import userRouter from "./routes/user.route.js";
import doctorRouter from "./routes/doctor.route.js";

connectToDb();

const app = express(); // Initialize app first

app.use(cors()); // Now use cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/doctors", doctorRouter);

export default app;
