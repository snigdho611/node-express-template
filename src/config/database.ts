import { Application } from "express";
import mongoose from "mongoose";

const databaseConnection = async (callback: Application["listen"]) => {
    try {
        console.log("Connecting to database...");
        if (process.env.DATABASE_URL) {
            const client = await mongoose.connect(process.env.DATABASE_URL);
            if (client) {
                console.log("Database connection completed, running with database connection");
            }
            callback();
        } else {
            console.log("Database connection string unavailable, running without database connection");
            callback();
        }
    } catch (error: unknown) {
        console.log(error);
        throw new Error((error as Error).message);
    }
};

export default databaseConnection;
