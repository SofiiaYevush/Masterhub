import User from "../models/user.model.js";
import Gig from "../models/gig.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const loginAdmin = async (req, res, next) => {
    try {
      const { username, password, ...info } = req.body;
  
      const admin = await User.findOne({ username: process.env.ADMIN_USERNAME });
  
      if (!admin) {
        const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 5);
        const newAdmin = new User({
          username: process.env.ADMIN_USERNAME,
          email: "admin@example.com",
          password: hash,
          isAdmin: true,
        });
  
        await newAdmin.save();
      }
  
      if (
        username !== process.env.ADMIN_USERNAME ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        return next(createError(401, "Invalid admin credentials"));
      }
  
      const token = jwt.sign(
        { id: "admin_id", isAdmin: true },
        process.env.JWT_KEY
      );
  
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .send(info);
    } catch (err) {
      next(err);
    }
};
  
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    res.status(200).send("User has been blocked");
  } catch (err) {
    next(err);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    res.status(200).send("User has been unblocked");
  } catch (err) {
    next(err);
  }
};

export const deleteAnyGig = async (req, res, next) => {
  try {
    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted by admin");
  } catch (err) {
    next(err);
  }
};
