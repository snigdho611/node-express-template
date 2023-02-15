import { Application } from "express";
import mongoose from "mongoose";

const databaseConnection = async (callback: Application["listen"]) => {
  try {
    console.log("Connecting to database...");
    console.log(callback);
    if (process.env.DATABASE_URL) {
      // const client = await mongoose.connect(process.env.DATABASE_URL);
      const client = await mongoose.connect(process.env.DATABASE_URL);
      if (client) {
        console.log("Database connection completed");
      }
      callback();
    } else {
      console.log("Database connection string unavailable");
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};


export default databaseConnection;