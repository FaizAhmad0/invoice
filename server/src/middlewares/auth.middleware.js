import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.model.js";
import AppError from "../utils/app-error.js";

const authenticate = async (req, res, next) => {
  let token = null;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const decoded = verifyToken(token);

    // Apply the same schema defaults as login for older accounts without tokenVersion.
    const user = await User.findById(decoded.id).select("tokenVersion role");
    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      return next(new AppError("Session invalidated. Please log in again", 401));
    }

    req.user = { ...decoded, tokenVersion: user.tokenVersion };
    next();
  } catch (_error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export default authenticate;
