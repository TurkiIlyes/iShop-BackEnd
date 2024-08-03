import path from "path";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import dbConnect from "./config/dbConnect";
import globalError from "./middlewares/globalError";
import ApiError from "./utils/ApiError";

import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import basketRoute from "./routes/basketRoute";
import orderRoute from "./routes/orderRoute";
import wishListRoute from "./routes/wishListRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

dbConnect();

app.use(cors());
app.options("*", cors());

app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/basket", basketRoute);
app.use("/orders", orderRoute);
app.use("/wishlist", wishListRoute);
app.use("/categories", categoryRoute);
app.use("/products", productRoute);

app.use("*", (req, res, next) => {
  next(new ApiError("Can't find this route ", 404));
});

app.use(globalError);

const port = parseInt(process.env.PORT || "3000");
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on("uncaughtException", () => {
  console.log("uncaughtException");
  server.close(() => {
    console.log(`APP SHUTTING DOWN... *.* `);
    process.exit(1);
  });
});
