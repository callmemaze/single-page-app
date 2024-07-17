import mongoose from "mongoose";

const taskModelSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const taskModel = mongoose.model("taskModelSchema", taskModelSchema);

export default taskModel;
