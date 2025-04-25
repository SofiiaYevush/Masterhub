import createError from "../utils/createError.js";

export const verifyAdmin = (req, res, next) => {
  if (!req.isAdmin) return next(createError(403, "Admin only route"));
  next();
};
