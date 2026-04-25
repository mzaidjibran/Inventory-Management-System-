import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/config.js';
import path from 'path'
import { fileURLToPath } from "url"
import cors from 'cors'
import dotenv from 'dotenv'
import UserRoutes from './routes/User.js'
import AccountRoutes from './routes/Account.js'
dotenv.config()
const port = process.env.PORT || 5000

// Middleware
const app = express()
app.use(express.json())
app.use(cors())


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(__filename);

if (process.env.NODE_ENV == "production") {
    app.use(express.static(__dirname, "../Frontend/Inventry-Management-System/"))
    app.get("*", (request, response) => {
        response.sendFile(__dirname, "index.html")
    })
}

connectDB()

// Routes
app.use('/api/user', UserRoutes)
app.use('/api/account', AccountRoutes)

// test route
app.get("/", (req, res) => {
    res.send("API is running...")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})