import express from "express"
import mongoose from "mongoose"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { importEnv } from "./utils.js"

await importEnv()

// Environment Variables
const PORT = parseInt(process.env.PORT)
const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD
const CLIENT_URL = process.env.CLIENT_URL

// Initialization
const app = express()

// Middlewares
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use("/auth", userRoutes)

mongoose
  .connect(
    `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@auth.h7vajtq.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => app.listen(PORT))
