import mongoose from "mongoose";

const userRefreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  blackListed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expire: "5d" },
});

const userRefreshTokenModel = mongoose.model(
  "UserRefreshToken",
  userRefreshTokenSchema
);

export default userRefreshTokenModel;
