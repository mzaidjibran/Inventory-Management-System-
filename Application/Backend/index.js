import express from "express";
import connectDB from "./config/config.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import UserRoutes from "./routes/Userroute.js";
import AccountRoutes from "./routes/Accountroute.js";
import EmployeeRoutes from "./routes/Epolyeeroute.js";
import ProductRoutes from "./routes/Productsroot.js";
import PurchaseRoutes from "./routes/Purchaseroot.js";
import BillingRoutes from "./routes/bilingroute.js";
import ScanRoutes from "./routes/Scanerroot.js";
import Shopexpence from "./models/Shopexpence.js";
import SuplierRoutes from "./routes/Suplierroot.js";
import ClientRoutes from "./routes/clientroot.js";
dotenv.config();
const port = process.env.PORT || 5000;

// Middleware
const app = express();
app.use(express.json());
app.use(cors());
//frontend connection
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/image", express.static(path.join(__dirname, "image")));

if (process.env.NODE_ENV == "production") {
  app.use(
    express.static(
      path.join(__dirname, "../Frontend/Inventry-Management-System/"),
    ),
  );
  app.get("*", (request, response) => {
    response.sendFile(
      path.join(__dirname, "../Frontend/Inventry-Management-System/index.html"),
    );
  });
}

await connectDB();

// Routes
app.use("/api/user", UserRoutes);
app.use("/api/account", AccountRoutes);
app.use("/api/employee", EmployeeRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/purchase", PurchaseRoutes);
app.use("/api/shopexpence", Shopexpence);
app.use("/api/scan", ScanRoutes);
app.use("/api/billing", BillingRoutes);
app.use("/api/suplier", SuplierRoutes);
app.use("/api/client", ClientRoutes);
// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});
// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
