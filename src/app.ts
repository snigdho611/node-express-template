import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import postRouter from "./routes/post";
import databaseConnection from "@config/database";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/posts", postRouter);

databaseConnection(() => {
    return app.listen(process.env.PORT ? process.env.PORT : 8000, () => {
        console.log(`Application is running on ${process.env.PORT ? process.env.PORT : 8000}`);
    });
});
