import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import userRouter from "./routes/user";
import databaseConnection from "./config/database";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", userRouter);

 {/*
    The databaseConnection function is set up optonally
    If a valid mongodb database connection string exists in the environment,
    Uncomment the databaseConnection function below
  */}

// databaseConnection((): any => {
  app.listen(process.env.PORT, () => {
    console.log("Application is running on 8000");
  });
// });
