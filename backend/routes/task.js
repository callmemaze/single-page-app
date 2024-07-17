import express from "express";
import {
  createTask,
  deleteTask,
  getAllTask,
  updateTask,
} from "../controllers/task.js";
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", accessTokenAutoRefresh, auth, getAllTask);
router.post("/create-task", accessTokenAutoRefresh, auth, createTask);
router.delete("/delete/:id", accessTokenAutoRefresh, deleteTask);
router.post("/update/:id", accessTokenAutoRefresh, updateTask);

export default router;
