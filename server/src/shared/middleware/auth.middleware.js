import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const auth = async (req, res, next) => {
  try {
    let token;
    // 1. Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const error = new Error("Not logged in");
      error.statusCode = 401;
      throw error;
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      const error = new Error("User belonging to this token no longer exists.");
      error.statusCode = 401;
      throw error;
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error("You do not have permission to perform this action");
      error.statusCode = 403;
      throw error;
    }
    next();
  };
};