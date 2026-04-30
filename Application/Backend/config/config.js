import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || "inventory_management_system",
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PASSWORD || "",
  {
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: "mysql",
    logging: false,
  },
);

// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync();
//     console.log("Database Connected");
//   } catch (error) {
//     console.log(error.message);
//     process.exit(1);
//   }
// };

// export { sequelize };
// export default connectDB;

import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
