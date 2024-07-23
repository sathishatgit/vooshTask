import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRoute from "./route/userRoute.js";
import taskRouter from "./route/taskRoute.js";
dotenv.config();
async function run() {
  try {
    await mongoose.connect(process.env.mongoUrl);
    console.log("Connected to MongoDB successfuly!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/task", taskRouter);

app.get("/", (req, res) => res.send("Sathish API"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
