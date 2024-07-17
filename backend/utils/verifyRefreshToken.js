import jwt from "jsonwebtoken";
import userRefreshTokenModel from "../models/userRefreshToken.js";

const verifyRefreshToken = async (refreshToken) => {
  try {
    const privateKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
    const userRefreshToken = await userRefreshTokenModel.findOne({
      token: refreshToken,
    });

    if (!userRefreshToken) {
      throw { error: true, message: "Invalid Refresh Token" };
    }
    const tokenDetails = jwt.verify(refreshToken, privateKey);
    return {
      tokenDetails,
      error: false,
      message: "Valid refresh token",
    };
  } catch (error) {
    throw { error: true, message: "Invalid refresh token" };
  }
};

export default verifyRefreshToken;
