import mongoose from "mongoose";
const connectDB = async function () {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    // console.log(connectInstance)
    console.log(
      `Database connection is successfully established  ${connectInstance.connection.host}`
    );
  } catch (error) {
    console.log("Failed to connect with the database", error);
    process.exit(1);
  }
};

export default connectDB;
