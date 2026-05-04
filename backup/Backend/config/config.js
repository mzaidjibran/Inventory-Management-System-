import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/inventory_management_system";
  try {
    await mongoose.connect(mongoUri, {
      // useNewUrlParser and useUnifiedTopology are default in mongoose >=6
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message || error);
    process.exit(1);
  }
};

export default connectDB;
