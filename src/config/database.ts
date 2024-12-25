import { Application } from "express";
import mongoose from "mongoose";
import logger from "@config/logger";

const databaseConnection = async (callback: Application["listen"]) => {
    try {
        logger.info("Connecting to database...");
        if (process.env.DATABASE_URL) {
            const client = await mongoose.connect(process.env.DATABASE_URL);
            if (client) {
                logger.info("Database connection completed, running with database connection");
            }
            callback();
        } else {
            logger.error("Database connection string unavailable, running without database connection");
            callback();
        }
    } catch (error: unknown) {
        logger.error(error);
        throw new Error((error as Error).message);
    }
};

export default databaseConnection;
