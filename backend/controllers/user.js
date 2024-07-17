import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModal from "../models/userModel.js";
import generateTokens from "../utils/generateTokens.js";
import setTokensCookies from "../utils/setTokenCookies.js";
import userModel from "../models/userModel.js";
import userRefreshTokenModel from "../models/userRefreshToken.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "failed", message: "Email and password are required" });
  }
  const oldUser = await UserModal.findOne({ email });
  if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

  const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

  if (!isPasswordCorrect)
    return res.status(400).json({ message: "Invalid credentials" });
  const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
    await generateTokens(oldUser);

  setTokensCookies(
    res,
    accessToken,
    refreshToken,
    accessTokenExp,
    refreshTokenExp
  );

  res.status(200).json({
    user: {
      id: oldUser._id,
      email: oldUser.email,
      name: oldUser.name,
    },
    status: "success",
    message: "Login Success",
    access_token: accessToken,
    refresh_token: refreshToken,
    access_token_exp: accessTokenExp,
    is_auth: true,
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }
    const oldUser = await UserModal.findOne({ email });
    if (oldUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserModal.create({
      email,
      password: hashedPassword,
      name,
    });
    res.status(201).json({
      status: "success",
      message: "User Registered",
      user: {
        id: result._id,
        email: result.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const profile = async (req, res) => {
  const user = await userModel
    .findById({ _id: req.userId })
    .select("-password");
  res.status(200).json({ user });
};

export const userLogout = async (req, res) => {
  try {
    // Optionally, you can blacklist the refresh token in the database
    const refreshToken = req.cookies.refreshToken;
    await userRefreshTokenModel.findOneAndUpdate(
      { token: refreshToken },
      { $set: { blacklisted: true } }
    );

    // Clear access token and refresh token cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("is_auth");

    res.status(200).json({ status: "success", message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Unable to logout, please try again later",
    });
  }
};
