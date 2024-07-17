import userModel from "../models/userModel.js";
import userRefreshTokenModel from "../models/userRefreshToken.js";
import generateTokens from "./generateTokens.js";
import verifyRefreshToken from "./verifyRefreshToken.js";

const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const { tokenDetails, error } = await verifyRefreshToken(oldRefreshToken);

    if (error) {
      return res
        .status(401)
        .send({ status: "failed", meesage: "Invalid refresh token" });
    }
    const user = await userModel.findById(tokenDetails._id);
    if (!user) {
      return res
        .status(404)
        .send({ status: "failed", message: "User not found" });
    }
    const userRefreshToken = await userRefreshTokenModel.findOne({
      userId: tokenDetails._id,
    });
    if (
      oldRefreshToken !== userRefreshToken.token ||
      userRefreshToken.blackListed
    ) {
      return res
        .status(401)
        .send({ status: "failed", message: "Unauthorized access" });
    }

    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(user);

    return {
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
      newAccessTokenExp: accessTokenExp,
      newRefreshTokenExp: refreshTokenExp,
    };
  } catch (error) {
    res
      .status(500)
      .send({ status: "failed", message: "Internal server error" });
  }
};

export default refreshAccessToken;
