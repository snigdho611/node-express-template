import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import postRouter from "./routes/post";
import prisma from "@config/database";
import CustomResponse from "@util/commonResponse";
import { HTTP_STATUS } from "@util/httpStatus";
import logger from "@config/logger";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/posts", postRouter);


app.use((error: Error, req: Request, res: Response, _: NextFunction) => {
    logger.error(
        `path: ${req.originalUrl},
    headers: ${JSON.stringify({ ...req.headers })},
    body: ${JSON.stringify(req.body)},
    query: ${JSON.stringify(req.query)},
    error: ${error.stack}`
    );
    CustomResponse.send(
        res,
        res.locals.status ?? HTTP_STATUS.INTERNAL_SERVER_ERROR,
        res.locals.message ?? "Internal server error"
    );
    return;
});

async function main() {
    app.listen(process.env.PORT ? process.env.PORT : 8000, () => {
        logger.info(`Application is running on ${process.env.PORT ? process.env.PORT : 8000}`);
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
