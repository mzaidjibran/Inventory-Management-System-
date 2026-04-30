import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/inventory_management_system";

    await mongoose.connect(mongoUri);
    console.log("Database Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
