import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";

dotenv.config({ path: "./Application/Backend/.env" });

async function seed() {
  // Define adminData outside try block so it's accessible in catch block
  let adminData = null;

  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/inventory_management_system";
    console.log("Connecting to MongoDB...", mongoURI);

    // Precompute password hash and admin payload
    const plainPassword = "admin123";
    const hash = await bcrypt.hash(plainPassword, 10);

    adminData = {
      Name: "Admin",
      email: "admin@manngo.com",
      password: hash,
      role: "admin",
      createdBy: "admin",
    };

    // Use MongoDB native driver for direct insert
    const client = new MongoClient(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });

    await client.connect();
    console.log("Connection Successful!");

    const db = client.db("inventory_management_system");
    const usersCollection = db.collection("users");

    // Upsert admin
    const result = await usersCollection.updateOne(
      { email: "admin@manngo.com" },
      { $set: adminData },
      { upsert: true },
    );

    if (result.upsertedId || result.matchedCount) {
      console.log("Created");
    }

    await client.close();
  } catch (error) {
    console.error("Error Message:", error.message);

    // Write fallback JSON
    if (adminData) {
      try {
        const fallback = {
          note: "Admin document to insert into the users collection.",
          document: { ...adminData },
          passwordPlain: "admin123",
          mongoShellInsert: `db.users.insertOne(${JSON.stringify({ ...adminData }, null, 2)})`,
        };

        const outPath = path.resolve(process.cwd(), "admin-fallback.json");
        await fs.writeFile(outPath, JSON.stringify(fallback, null, 2), "utf8");
        console.log("Wrote fallback to", outPath);
      } catch (fsErr) {
        console.error("Failed to write fallback file:", fsErr.message);
      }
    }
  } finally {
    process.exit();
  }
}

seed();
