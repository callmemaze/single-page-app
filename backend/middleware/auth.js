import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

const auth = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) return res.status(403).json("You don't have authority");

    const token = req.headers.authorization.split(" ")[1];
    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?._id;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
