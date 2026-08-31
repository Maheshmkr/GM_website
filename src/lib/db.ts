/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "gm-website";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not configured. Add it in Vercel → Project → Settings → Environment Variables.",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("MongoDB Atlas connected successfully");
      return m;
    }).catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
