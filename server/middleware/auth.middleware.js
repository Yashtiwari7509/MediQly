import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const authUser = async (req, res, next) => {
  const token =  req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "unauthorized token" });
  }

  try {
    // const isBlackListed = await blacklistTokenModel.findOne({
    //   token,
    // });
    // console.log(token, isBlackListed, "2nd");

    // if (isBlackListed) {
    //   return res.status(401).json({ message: "unauthorized token" });
    // }
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const user = await userModel.findById(decoded);

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
