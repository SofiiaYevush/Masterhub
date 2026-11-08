import "dotenv/config";

import mongoose from "mongoose";
import app from "./app.js";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.listen(process.env.PORT || 8800, () => {
  connect();
  console.log("Backend server is running!");
});
