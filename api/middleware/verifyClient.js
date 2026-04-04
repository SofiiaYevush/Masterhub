import createError from "../utils/createError.js";

export const verifyClient = (req, res, next) => {
    if (req.isSeller || req.isAdmin) {
        return next(createError(403, "Only clients can perform this action"));
    }

    next();
};