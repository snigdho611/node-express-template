import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import postRouter from "./routes/post";
import prisma from "@config/database";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/posts", postRouter);

async function main() {
    app.listen(process.env.PORT ? process.env.PORT : 8000, () => {
        console.log(`Application is running on ${process.env.PORT ? process.env.PORT : 8000}`);
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async () => {
        await prisma.$disconnect();
        process.exit(1);
    });
