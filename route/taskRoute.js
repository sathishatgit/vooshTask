import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controller/taskController.js";

const taskRouter = Router();
taskRouter.post("/create", createTask);
taskRouter.post("/all", getTasks);
taskRouter.get("/view/:id", getTaskById);
taskRouter.put("/update/:id", updateTask);
taskRouter.delete("/delete/:id", deleteTask);

export default taskRouter;
