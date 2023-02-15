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
app.set("view engine", "ejs");

app.use("/users", userRouter);
// app.use("/admin", adminRouter);
// app.use("/cart", cartRouter);
// app.use("/files", imagesRouter);
// app.use("/auth", authenticateRouter);
// app.use("/sales", salesRouter);

databaseConnection((): any => {
  app.listen(8000, () => {
    console.log("Application is running on 8000");
  });
});
