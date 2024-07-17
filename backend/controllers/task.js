import mongoose from "mongoose";
import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import ShortUniqueId from "short-unique-id";

export const createTask = async (req, res) => {
  const { title, status } = req.body;
  if (!title || !status) {
    return res
      .status(400)
      .json({ status: "failed", message: "Title and Status are required" });
  }

  const { randomUUID } = new ShortUniqueId({ length: 4 });
  const id = randomUUID().toUpperCase();
  const taskId = `Task-${id}`;
  const user = await userModel
    .findById({ _id: req.userId })
    .select("-password");
  const result = await taskModel.create({
    taskId,
    title,
    status,
    user,
  });
  res.status(201).json({
    status: "success",
    message: "Task added",
    task: result,
  });
};

export const getAllTask = async (req, res) => {
  const user = await userModel
    .findById({ _id: req.userId })
    .select("-password");
  const tasks = await taskModel.find({ user: user });
  res.status(200).json({ tasks });
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const result = await taskModel.findByIdAndDelete({ _id: id });
  res.status(200).json({ message: "Successfully deleted" });
};

export const updateTask = async (req, res) => {
  const { id: _id } = req.params;
  const { title, status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No post with id: ${_id}`);
  const updatedTask = { title, status, _id: _id };
  await taskModel.findByIdAndUpdate(_id, updatedTask, {
    new: true,
  });
  res.status(200).json({ message: "Successfully updated", updateTask });
};
